describe('Edit Profile Flow', () => {
  const BASE_URL = 'http://localhost:3000';
  const EMAIL = 'camagc6@gmail.com';
  const PASSWORD = '12345678';
  const ORIGINAL_NAME = 'Gilberto Camacho';

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

  it('Changes the name in profile and resets it back', () => {
    cy.visit(`${BASE_URL}/home`);

    // Confirmación de login correcto
    cy.contains('Welcome, Gilberto Camacho', { timeout: 10000 }).should('be.visible');

    // Abre sidebar
    cy.get('.floating-expand-btn-header').click();

    // Click en "Profile" desde el sidebar
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();

    // Confirmar navegación
    cy.url({ timeout: 10000 }).should('include', '/profile');

    // Click en "Edit Profile"
    cy.get('button.edit-button').click();

    // Cambiar nombre por uno aleatorio
    const newName = `User ${Math.floor(Math.random() * 10000)}`;
    cy.get('input[name="name"]').clear().type(newName);

    // Scroll down y guardar
    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    // Esperar que guarde y vuelva el botón de editar
    cy.get('button.edit-button', { timeout: 10000 }).should('exist').click();

    // Reestablecer nombre original
    cy.get('input[name="name"]').clear().type(ORIGINAL_NAME);

    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    // Confirmar visualmente que se ve el nombre correcto
    cy.contains(ORIGINAL_NAME, { timeout: 10000 }).should('exist');
  });
});
