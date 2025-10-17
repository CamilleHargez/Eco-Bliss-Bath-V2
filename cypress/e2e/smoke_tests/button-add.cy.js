describe('button-add', () => {
    beforeEach(() => {
        cy.login()
    })

    it('The add button exist and be visible', () => {
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()
        cy.get('[data-cy="detail-product-add"]').should('exist')
        cy.get('[data-cy="detail-product-add"]').should('be.visible')
    })

    it('The quantity input exist and be visible', () => {
        cy.get('[data-cy="product-home-link"]').should('exist')
            .first().click()
        cy.get('[data-cy="detail-product-quantity"]').should('exist')
        cy.get('[data-cy="detail-product-quantity"]').should('be.visible')
    })
})