describe('XSS vulnerability', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('#/reviews')
    })

    it('title should not allow script execution', () => {
        const payloadTitle = '<script>window.__xss_title = true;</script>'
        const payloadComment = '<script>window.__xss_comment = true;</script>'


        cy.intercept('GET', '**/reviews').as('getReviews')

        cy.get('[data-cy="review-input-title"]').clear().type(payloadTitle)
        cy.get('[data-cy="review-input-comment"]').clear().type(payloadComment)
        cy.get('[data-cy="review-input-rating-images"] img')
            .eq(1)
            .click()

        cy.get('[data-cy="review-submit"]').click()
        cy.wait('@getReviews').then(() => {
            cy.wait(5000)
        })

        cy.window().its('__xss_title').should('be.undefined')

        cy.get('[data-cy="review-detail"]').find('script').should('not.exist')
        cy.get('[data-cy="review-detail"]').invoke('html').should('not.contain', '<script>')
    })
})
