describe('POST reviews', () => {
    const baseUrl = 'http://localhost:8081'
    const username = 'test2@test.fr'
    const password = 'testtest'

    it('Ajouter un avis', () => {
        // Connexion et récupère le token
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            body: { username, password }
        }).then((loginResponse) => {
            expect(loginResponse.status).to.eq(200)

            const token = loginResponse.body.token
            expect(token).to.exist
            const authHeader = { Authorization: `Bearer ${token}` }

            // Ajoute un avis
            cy.request({
                method: 'POST',
                url: `${baseUrl}/reviews`,
                body: {
                    "title": "titreTest", 
                    "comment": "avisTest", 
                    "rating": 5},
                headers: authHeader
            }).then((reviewsResponse) => {
                expect(reviewsResponse.status).to.eq(200)
            })
        })
    })
})