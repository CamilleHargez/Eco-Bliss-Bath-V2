describe('GET orders', () => {

    it('Without token', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })

    it('With wrong token', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            headers: {
                Authorization: 'Bearer invalid_token'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
})

describe('POST login', () => {

    it('username and wrong password', () => {
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

     it('wrong username and password', () => {
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

    it('username and password', () => {
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













