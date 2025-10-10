describe('GET orders', () => {
    const baseUrl = 'http://localhost:8081'
    const username = 'test2@test.fr'
    const password = 'testtest'
    const productInStockId = 5  
    const productOutOfStockId = 3

    it('Requete de la liste des produits du panier', () => {
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

            // Récupère le panier en cours et supprime les produits qui s'y trouve
            cy.request({
                method: 'GET',
                url: `${baseUrl}/orders`,
                headers: authHeader
            }).then((ordersResponse) => {
                expect(ordersResponse.status).to.eq(200)

                const orderLines = ordersResponse.body.orderLines;

                if (orderLines.length > 0) {
                    cy.wrap(orderLines).each((line) => {
                        cy.request({
                            method: 'DELETE',
                            url: `${baseUrl}/orders/${line.id}/delete`,
                            headers: authHeader
                        }).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200)
                        })
                    })
                }

                // Ajoute un produit en stock au panier
                cy.request({
                    method: 'PUT',
                    url: `${baseUrl}/orders/add`,
                    headers: authHeader,
                    body: { product: productInStockId, quantity: 1 }
                }).then((addProductResponse) => {
                    expect(addProductResponse.status).to.eq(200)

                    // Vérifie que le produit en stock se trouve dans le panier
                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/orders`,
                        headers: authHeader
                    }).then((cartResponse) => {
                        expect(cartResponse.status).to.eq(200)
                        const found = cartResponse.body.orderLines.find(l => String(l.product?.id) === String(productInStockId))
                        expect(found).to.exist
                    })

                    // Ajoute un produit en rupture de stock au panier et vérifie qu'on reçoit une erreur 
                    cy.request({
                        method: 'PUT',
                        url: `${baseUrl}/orders/add`,
                        headers: authHeader,
                        body: { productId: productOutOfStockId, quantity: 1 },
                        failOnStatusCode: false
                    }).then((noStockResponse) => {
                        expect(noStockResponse.status).to.not.eq(200)
                    })
                })
            })
        })
    })
})