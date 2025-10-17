describe('button-login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('The login button exist and be visible', () => {
        cy.get('[data-cy="nav-link-login"]').should('exist')
        cy.get('[data-cy="nav-link-login"]').should('be.visible')
    })
})