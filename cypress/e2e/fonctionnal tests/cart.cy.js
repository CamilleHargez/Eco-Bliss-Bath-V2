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
        cy.login()
        cy.emptyCart()
    })

    it('Vérifier que le produit a été ajouté au panier', () => {
        cy.get('[data-cy="product-home-link"]').first().click()
        cy.get('[data-cy="detail-product-name"]').invoke('text').then((productName) => {
            cy.get('[data-cy="detail-product-add"]').first().click()
            cy.get('[data-cy="detail-product-add"]').click()
            cy.url().should('include', '/cart')
            cy.get('[data-cy="cart-line-name"]').should('contain', productName)
        })

    })

    it('Vérifier la mise à jour du stock')
    it('Vérifier les limites du stock')


})




// describe('Add product to cart', () => {
//     beforeEach(() => {
//         cy.login()
//         cy.intercept('GET', '/products/random', { fixture: 'products.json' }).as('getProductsRandom')

//     })

//     it('Click on product', () => {
//         cy.get('[data-cy="product-home"]').should('exist')
//         cy.get('[data-cy="product-home-link"]').should('exist')
//             .first().click()

//         cy.url().then((url) => {
//             const id = url.split('/').pop() //découpe l'url et prend le dernier élément du tableau
//             cy.log('ID du produit visité : ' + id)
//             expect(Number(id)).to.be.a('number')
//         })
//     })

//     it('The button is not disabled if stock is >0', () => {
//         cy.goToProduct789()
//         cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
//             const stock = parseInt(stockText, 10) || 0

//             if (stock <= 0) {
//                 cy.get('[data-cy="add-to-cart"]').should('be.disabled')
//             } else {
//                 cy.get('[data-cy="add-to-cart"]').should('not.be.disabled').click()
//             }
//         })

//     })

//     it('Add a product to cart')
//     it('Verify the stock input')
// })