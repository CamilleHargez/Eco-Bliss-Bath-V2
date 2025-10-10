describe('Acceder à un produit', () => {
    beforeEach(() => {
        cy.intercept('GET', '/products/random', { fixture: 'products.json' }).as('getProductsRandom')
        cy.login()
        cy.wait('@getProductsRandom')
    })

    it('vérifier si un produit peut être ajouté lorsque le stock est supérieur à 0', () => {
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

    it('Vérifier que le bouton d ajout au panier est disabled si le stock égal ou inférieur à 0', () => {
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

    it('Vérifier que le champ de disponibilité de mon produit est présent lorsque le stock est positif', () => {
        cy.intercept('GET', '/products/555', { fixture: 'product-555.json' }).as('getProductWithStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()
        cy.wait('@getProductWithStock')
        cy.get('[data-cy="detail-product-stock"]').should('exist')
    })

    it('Vérifier que le champ de disponibilité de mon produit est présent lorsque le stock est inférieur ou égal à 0', () => {
        cy.intercept('GET', '/products/789', { fixture: 'product-789.json' }).as('getProductWithoutStock')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .eq(1).click()
        cy.wait('@getProductWithoutStock')
        cy.get('[data-cy="detail-product-stock"]').should('exist')
    })

})

describe('Ajouter un élément au panier', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/orders').as('getCart')
        cy.intercept('PUT', '**/orders/add').as('addToCart')
        cy.intercept('GET', '**/products/*').as('getProducts')
        cy.login()
        cy.emptyCart()
    })

    it('Vérifier que le produit a été ajouté au panier', () => {
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

    it('Vérifier la mise à jour du stock', () => {

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



    it('Vérifier les limites du stock avec un chiffre négatif', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-quantity"]').clear().invoke('val', '-10').trigger('input').should('have.class', 'ng-invalid')
        cy.get('[data-cy="detail-product-add"]').click()
        cy.url().should('include', '/products')
    })


    it('Vérifier les limites du stock avec un chiffre supérieur à 20', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-quantity"]').clear().invoke('val', '26').trigger('input').should('have.class', 'ng-invalid')
    })
})

describe('Ajouter un élément au panier', () => {
    beforeEach(() => {
        cy.login()
        cy.emptyCart()
        cy.intercept('PUT', '**/orders/add').as('addToCart')
        cy.intercept('GET', '**/orders').as('getCart')
    })

    it('Vérifier le contenu du panier via API', () => {
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
                    expect(orderLines, 'orderLines doit exister').to.exist

                    const found = orderLines.find(line => String(line.product.id) === String(productId))
                    expect(found, `Le produit ${productId} doit être présent dans le panier`).to.exist


                })
            })

        })
    })
})

