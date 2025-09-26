Cypress.Commands.add('login', () => {
    cy.visit('#/login')

    cy.get('[data-cy="login-input-username"]')
        .type('test2@test.fr')

    cy.get('[data-cy="login-input-password"]')
        .type('testtest')

    cy.get('[data-cy="login-submit"]')
        .click()

    cy.url().should('include', '/')
    cy.get('[data-cy="nav-link-cart"]')
})

Cypress.Commands.add('emptyCart', () => {
    cy.get(`[data-cy="nav-link-cart"]`).click()
    cy.url().should('include', '/cart')
    cy.get('body').then(($body) => {
        if ($body.find('[data-cy="cart-line-delete"]').length > 0) {
            cy.get('[data-cy="cart-line-delete"]').click()
        }
    })
    cy.get(`[data-cy="nav-link-home"]`).click()
})


Cypress.Commands.add('goToProduct789', () => {
    cy.intercept('GET', '/products/random', { fixture: 'products.json' }).as('getProductsRandom')
    cy.visit('/')
    cy.wait('@getProductsRandom')
    cy.intercept('GET', `/products/789`, { fixture: `product-789.json` }).as('getProductDetail')
    cy.get(`[data-cy="product-home-link"]`).eq(1).click()
    cy.get('[data-cy="detail-product-stock"]').should('be.visible')
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })