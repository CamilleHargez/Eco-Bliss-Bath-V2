describe('input-login', () => {
    beforeEach(() => {
        cy.visit('#/login')
    })

    it('The login input exist and be visible', () => {
        cy.get('[data-cy="login-input-username"]').should('exist')
        cy.get('[data-cy="login-input-username"]').should('be.visible')
    })
})