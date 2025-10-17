describe('GET products/{id}', () => {
    const expectedId = 5
    const expectedName = 'Poussière de lune'

    it('Specific product sheet query', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/products/5'
        })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.id).to.eq(expectedId)
                expect(response.body.name).to.eq(expectedName)
            })
    })
})