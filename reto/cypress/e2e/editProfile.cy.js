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
    cy.contains('Check your notifications and active certifications', { timeout: 20000 }).should('be.visible');

    // Open sidebar
    cy.get('.floating-expand-btn-header').click();

    // Click "Profile"
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/profile');

    // Edit name to random
    cy.get('button.edit-button').click();
    const newName = `User ${Math.floor(Math.random() * 10000)}`;
    cy.get('input[name="name"]').clear().type(newName);

    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    // Confirm with password
    cy.get('input[type="password"][placeholder="Your password "]', { timeout: 10000 })
      .type(PASSWORD);
    cy.get('button.confirm-button').click();

    // Wait for button to reappear and restore original name
    cy.get('button.edit-button', { timeout: 10000 }).should('exist').click();
    cy.get('input[name="name"]').clear().type(ORIGINAL_NAME);

    cy.scrollTo('bottom');
    cy.get('button.save-button').click();

    cy.get('input[type="password"][placeholder="Your password "]', { timeout: 10000 })
      .type(PASSWORD);
    cy.get('button.confirm-button').click();

    // Confirm final name
    cy.contains(ORIGINAL_NAME, { timeout: 10000 }).should('exist');
  });
});
