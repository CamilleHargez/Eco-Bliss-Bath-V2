describe('Access to a product', () => {
    beforeEach(() => {
        cy.intercept('GET', '/products/random', { fixture: 'products.json' }).as('getProductsRandom')
        cy.login()
        cy.wait('@getProductsRandom')
    })

    it('Check if a product can be added to cart when stock is greater than 0', () => {
        cy.intercept('GET', '/products/555', { fixture: 'product-555.json' }).as('getProductWithStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()
        cy.wait('@getProductWithStock')
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stock = parseInt(stockText, 10) || 0

            if (stock > 0) {
                cy.get('[data-cy="detail-product-add"]').should('not.be.disabled')
            }
        })
    })

    it('Check that the add to cart button is disabled if the stock is equal to or less than 0', () => {
        cy.intercept('GET', '/products/789', { fixture: 'product-789.json' }).as('getProductWithoutStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .eq(1).click()
        cy.wait('@getProductWithoutStock')
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stock = parseInt(stockText, 10) || 0

            if (stock <= 0) {
                cy.get('[data-cy="detail-product-add"]').should('be.disabled')
            }
        })
    })

    it('Check that my products availability field is present when the stock is positive', () => {
        cy.intercept('GET', '/products/555', { fixture: 'product-555.json' }).as('getProductWithStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()
        cy.wait('@getProductWithStock')
        cy.get('[data-cy="detail-product-stock"]').should('exist')
    })

    it('Check that my products availability field is present when the stock is less than or equal to 0', () => {
        cy.intercept('GET', '/products/789', { fixture: 'product-789.json' }).as('getProductWithoutStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .eq(1).click()
        cy.wait('@getProductWithoutStock')
        cy.get('[data-cy="detail-product-stock"]').should('exist')
    })

})

describe('Add product to cart and check stock', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/orders').as('getCart')
        cy.intercept('PUT', '**/orders/add').as('addToCart')
        cy.intercept('GET', '**/products/*').as('getProducts')
        cy.login()
        cy.emptyCart()
    })

    it('Check that the product has been added to cart', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.wait('@getProducts')
        cy.get('[data-cy="detail-product-name"]').should('be.visible').invoke('text').then((productName) => {
            cy.get('[data-cy="detail-product-add"]').click()
            cy.wait('@getCart').then(() => {
                cy.wait(5000)
                cy.get('body').should('contain', productName)
                cy.get('body').contains(productName)
            })
        })

    })

    it('Check stock update', () => {

        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stockQuantity = parseInt(stockText, 10) || 0

            cy.get('[data-cy="detail-product-add"]').click()

            cy.wait('@getCart').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="detail-product-add"]').click()
            cy.get('[data-cy="detail-product-add"]').click()


            cy.url().should('eq', 'http://localhost:4200/#/cart')

            cy.get('[data-cy="cart-line-name"]').should('exist')

            cy.go('back')
            cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
                const newStockQuantity = parseInt(stockText, 10) || 0

                expect(newStockQuantity).to.equal(stockQuantity - 1)
            })
        })
    })



    it('Check stock limits with a negative number', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-quantity"]').clear().invoke('val', '-10').trigger('input').should('have.class', 'ng-invalid')
        cy.get('[data-cy="detail-product-add"]').click()
        cy.url().should('include', '/products')
    })


    it('Check stock limits with a number greater than 20', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-quantity"]').clear().invoke('val', '26').trigger('input').should('have.class', 'ng-invalid')
    })
})

describe('Add product to cart with API', () => {
    beforeEach(() => {
        cy.login()
        cy.emptyCart()
        cy.intercept('PUT', '**/orders/add').as('addToCart')
        cy.intercept('GET', '**/orders').as('getCart')
    })

    it('Check cart contents via API', () => {
        cy.get('[data-cy="product-home-link"]').first().click()

        cy.url().then((url) => {
            const productId = url.split('/').pop()

            cy.get('[data-cy="detail-product-add"]').click()
            cy.get('[data-cy="detail-product-add"]').click()

            cy.wait('@addToCart').its('response.statusCode').should('eq', 200)
            cy.window().then((win) => {
                const token = win.localStorage.getItem('user')
                cy.request({
                    method: 'GET',
                    url: 'http://localhost:8081/orders',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((resp) => {
                    expect(resp.status).to.eq(200)

                    const orderLines = resp.body.orderLines
                    expect(orderLines).to.exist

                    const found = orderLines.find(line => String(line.product.id) === String(productId))
                    expect(found, `The product ${productId} should be in cart`).to.exist
                })
            })

        })
    })
})

