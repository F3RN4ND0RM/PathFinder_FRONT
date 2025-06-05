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

    // Confirm login
    cy.contains('Welcome, Gilberto Camacho', { timeout: 10000 }).should('be.visible');

    // Open sidebar and go to profile
    cy.get('.floating-expand-btn-header').click();
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/profile');

    // Click "Edit Profile"
    cy.get('button.edit-button').click();

    // Change name
    const newName = `User ${Math.floor(Math.random() * 10000)}`;
    cy.get('input[name="name"]').clear().type(newName);

    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    // Confirm password
    cy.get('input[type="password"][placeholder="Your password "]', { timeout: 10000 }).type(PASSWORD);
    cy.get('button.confirm-button').click();

    // Go to top and edit again
    cy.scrollTo('top');
    cy.get('button.edit-button', { timeout: 10000 }).should('exist').click();

    // Restore original name
    cy.get('input[name="name"]').clear().type(ORIGINAL_NAME);
    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    // Confirm password again
    cy.get('input[type="password"][placeholder="Your password "]', { timeout: 10000 }).type(PASSWORD);
    cy.get('button.confirm-button').click();

    // Scroll up to validate
    cy.scrollTo('top');
    cy.contains(ORIGINAL_NAME, { timeout: 10000 }).should('exist');
  });
});
