describe('GET orders', () => {

    it('Sans token', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })

    it('Avec token erroné', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            headers: {
                Authorization: 'Bearer token_invalide'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
})

describe('POST login', () => {

    it('bon nom utilisateur mauvais mot de passe', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                "username": "test2@test.fr",
                "password": "wrong_password"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })

     it('mauvais nom utilisateur bon mot de passe', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                "username": "wrongusername@test.fr",
                "password": "testtest"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })

    it('bon nom utilisateur bon mot de passe', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                "username": "test2@test.fr",
                "password": "testtest"
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    })
})













