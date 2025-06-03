// cypress/e2e/login.cy.js
describe('Pruebas de Login en producción', () => {
  const BASE_URL = 'https://path-finder-front.vercel.app';
  const USER_EMAIL = 'camagc6@gmail.com';
  const USER_PASSWORD = '12345678';

  it('Login exitoso con contraseña existente ("Yes")', () => {
    cy.visit(`${BASE_URL}`);
    cy.get('#email').type(USER_EMAIL);
    cy.contains('button', 'Yes').click();
    cy.get('#password').type(USER_PASSWORD);
    cy.contains('button', 'Log in').click();
    cy.url().should('include', '/Home');
    cy.window().its('localStorage.authToken').should('exist');
  });

  it('Muestra error con credenciales inválidas', () => {
    cy.visit(`${BASE_URL}`);
    cy.get('#email').type('email_invalido@test.com');
    cy.contains('button', 'Yes').click();
    cy.get('#password').type('contraseña_incorrecta{enter}');
    cy.contains('button', 'Log in').click();
    cy.get('.alert.alert-danger.purple-alert', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Incorrect email or password');
  });
});