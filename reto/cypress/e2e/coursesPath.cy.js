describe('Career Path Form Flow', () => {
  const BASE_URL = 'http://localhost:3000';
  const EMAIL = 'camagc6@gmail.com';
  const PASSWORD = '12345678';

  beforeEach(() => {
    cy.session([EMAIL, PASSWORD], () => {
      cy.visit(BASE_URL);
      cy.get('input[type="email"]').type(EMAIL);
      cy.contains('button', 'Yes').click();
      cy.get('input[type="password"]').type(PASSWORD);
      cy.get('button.purple-btn').contains('Log in').click();
      cy.url({ timeout: 10000 }).should('include', '/home');
    });
  });

  it('Logs in and completes career path form', () => {
    cy.visit(`${BASE_URL}/home`);
    cy.contains('Welcome, Gilberto Camacho', { timeout: 10000 }).should('be.visible');

    cy.get('.floating-expand-btn-header').click();

    
    // Clic en "Career Path" usando href
    cy.get('a[href="/career"]', { timeout: 10000 }).click();

    // Confirmar redirección
    cy.url({ timeout: 10000 }).should('include', '/career');

    // Llenar formulario
    cy.get('textarea[name="objective"]')
      .should('be.visible')
      .type('I want to become a technical leader focused on scalable frontend solutions.');

    cy.get('textarea[name="skills"]')
      .should('be.visible')
      .type('React, testing strategies, and scalable UI architecture.');

    cy.get('textarea[name="values"]')
      .should('be.visible')
      .type('Creating meaningful impact and growing as a mentor.');

    // Enviar formulario
    cy.get('button[type="submit"]').contains('Find Courses').click();

    // Confirmar redirección a recomendaciones
    cy.url({ timeout: 30000 }).should('include', '/recommendations');
  });
});
