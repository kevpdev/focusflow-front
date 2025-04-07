describe('Login Page Tests', () => {
  let translate: any;
  const language = ['fr', 'en'];

  beforeEach(() => {
    cy.request(`http://localhost:4200/i18n/${language[0]}.json`).then(response => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).as('translations');
    });

    cy.visit('http://localhost:4200');
  });

  it('should display the page title', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get('.title').contains(translate.APP.TITLE);
    });
  });

  it('should display the login card and form', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get('.mat-mdc-card-title').contains(translate.LOGIN.FORM.TITLE);
      cy.get('[data-cy=login-form]').should('be.visible');
    });
  });

  it('should display all form elements', () => {
    cy.get('[data-cy=login-email]').should('be.visible');
    cy.get('[data-cy=login-password]').should('be.visible');
    cy.get('[data-cy=login-submit]').should('be.visible');
  });

  it('should submit when form valid', () => {
    cy.get('[data-cy="login-email"]').type('exemple@gmail.com');
    cy.get('[data-cy="login-password"]').type('Password44');
    cy.get('[data-cy=login-submit]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should display error message required', () => {
    cy.get('[data-cy=login-submit]').click();
    cy.get('[data-cy="login-email-error-required"]').should('be.visible');
    cy.get('[data-cy="login-password-error-required"]').should('be.visible');
  });

  it('should display error when invalid email pattern', () => {
    cy.get('[data-cy="login-email"]').type('wrongemail.com');
    cy.get('[data-cy="login-email"]').blur();
    cy.get('[data-cy="login-email-error-pattern"]').should('be.visible');
  });

  it('should display error when invalid password pattern', () => {
    cy.get('[data-cy="login-password"]').type('wrongpw');
    cy.get('[data-cy="login-password"]').blur();
    cy.get('[data-cy="login-password-error-minlength"]').should('be.visible');
    cy.get('[data-cy="login-password-error-pattern"]').should('be.visible');
  });

  it('should delete error when valid password pattern', () => {
    cy.get('[data-cy="login-password"]').type('Password44');
    cy.get('[data-cy="login-password-error-minlength"]').should('not.exist');
    cy.get('[data-cy="login-password-error-pattern"]').should('not.exist');
  });

  it('should delete error when valid email pattern', () => {
    cy.get('[data-cy="login-email"]').type('exemple@gmail.com');
    cy.get('[data-cy="login-email-error-pattern"]').should('not.exist');
  });
});
