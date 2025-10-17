describe('Login test', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('The login form work', () => {
        cy.get('[data-cy="nav-link-login"]')
            .click()
        
        cy.url().should('include', '/login')

        cy.get('[data-cy="login-input-username"]').should('exist')
            .type('test2@test.fr')

        cy.get('[data-cy="login-input-password"]').should('exist')
            .type('testtest')

        cy.get('[data-cy="login-submit"]')
            .click()

        cy.url().should('include', '/')
        cy.get('[data-cy="nav-link-cart"]') 
    })
})