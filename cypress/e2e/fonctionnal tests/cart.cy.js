describe('Add product to cart', () => {
    beforeEach(() => {
        cy.login()
        cy.intercept('GET', '/products/random', { fixture: 'products.json' }).as('getProductsRandom')

    })

    it('Click on product', () => {
        cy.get('[data-cy="product-home"]').should('exist')
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()

        cy.url().then((url) => {
            const id = url.split('/').pop() //découpe l'url et prend le dernier élément du tableau
            cy.log('ID du produit visité : ' + id)
            expect(Number(id)).to.be.a('number')
        })
    })

    it('The button is not disabled if stock is >0', () => {
        cy.goToProduct789()
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stock = parseInt(stockText, 10) || 0

            if (stock <= 0) {
                cy.get('[data-cy="add-to-cart"]').should('be.disabled')
            } else {
                cy.get('[data-cy="add-to-cart"]').should('not.be.disabled').click()
            }
        })

    })

        it('Add a product to cart')
        it('Verify the stock input')
})