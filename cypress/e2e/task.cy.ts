const language = ['fr', 'en'];

describe('Task Management Dashboard - General Tests', () => {
  beforeEach(() => {
    cy.request(`http://localhost:4200/i18n/${language[0]}.json`).then(response => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).as('translations');
    });

    cy.visit('http://localhost:4200/dashboard');
  });

  it('should display the task management title', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get("[data-cy='task-management-title']").contains(translate.TASK_MANAGEMENT.TITLE);
    });
  });

  it('should display task management buttons with correct states', () => {
    cy.get('[data-cy="add-task-button"]').should('be.visible').and('not.be.disabled');

    cy.get('[data-cy="save-changes-button"]').should('be.visible').and('be.disabled');
  });

  it('should display all task columns with correct titles', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get('[data-cy="column-pending"]')
        .should('be.visible')
        .contains(translate.CARD.LIST.TITLES.PENDING);

      cy.get('[data-cy="column-in-progress"]')
        .should('be.visible')
        .contains(translate.CARD.LIST.TITLES.IN_PROGRESS);

      cy.get('[data-cy="column-done"]')
        .should('be.visible')
        .contains(translate.CARD.LIST.TITLES.DONE);
    });
  });

  it('should display task cards in each column', () => {
    cy.get('[data-cy="task-list-content"]').should('be.visible');

    cy.get('[data-cy="column-pending"]').within(() => {
      cy.get('[data-cy="task-card"]').should('exist');
    });

    cy.get('[data-cy="column-in-progress"]').within(() => {
      cy.get('[data-cy="task-card"]').should('exist');
    });

    cy.get('[data-cy="column-done"]').within(() => {
      cy.get('[data-cy="task-card"]').should('exist');
    });
  });
});

describe('Task Card - Elements and Actions', () => {
  beforeEach(() => {
    cy.request(`http://localhost:4200/i18n/${language[0]}.json`).then(response => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).as('translations');
    });

    cy.visit('http://localhost:4200/dashboard');
  });

  it('should display all elements in card task', () => {
    cy.get('[data-cy="task-title"]').should('be.visible');
    cy.get('[data-cy="task-due-date"]').should('be.visible');
    cy.get('[data-cy="task-status"]').should('be.visible');
    cy.get('[data-cy="update-task-button"]').should('be.visible');
    cy.get('[data-cy="delete-task-button"]').should('be.visible');
  });

  it('should display all elements of the edit form', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get('[data-cy="update-task-button"]').first().click();
      cy.wait(2000);
      cy.get('[data-cy="edit-container"]').should('be.visible');
      cy.get('[data-cy="edit-dialog-title"]')
        .should('be.visible')
        .contains(translate.CARD.EDIT.EDIT_MODE_TITLE);
      cy.get('[data-cy="edit-title-field"]').should('be.visible');
    });
  });

  it('should display all elements of the add form', () => {
    cy.get('@translations').then((translate: any) => {
      cy.get('[data-cy="add-task-button"]').first().click();
      cy.wait(2000);
      cy.get('[data-cy="edit-container"]').should('be.visible');
      cy.get('[data-cy="edit-dialog-title"]')
        .should('be.visible')
        .contains(translate.CARD.EDIT.ADD_MODE_TITLE);
      cy.get('[data-cy="edit-title-field"]').should('be.visible');
      cy.get('[data-cy="edit-submit-button"]').should('be.disabled');
    });
  });
});

describe('Task Card - Confirmation Dialogs', () => {
  beforeEach(() => {
    cy.request(`http://localhost:4200/i18n/${language[0]}.json`).then(response => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).as('translations');
    });

    cy.visit('http://localhost:4200/dashboard');
  });

  it('should display the confirmation dialog when delete card button is clicked', () => {
    cy.get('[data-cy="delete-task-button"]').first().click();
    cy.wait(2000);
    cy.get('[data-cy="dialog-container"]').should('be.visible');
    cy.get('[data-cy="dialog-title"]').should('be.visible');
    cy.get('[data-cy="dialog-content"]').should('be.visible');
  });

  it('should close the confirmation dialog when cancel is clicked', () => {
    cy.get('[data-cy="delete-task-button"]').first().click();
    cy.wait(2000);
    cy.get('[data-cy="dialog-cancel-button"]').click();
    cy.get('[data-cy="dialog-container"]').should('not.exist');
  });

  it('should confirm the action when confirm button is clicked', () => {
    cy.get('[data-cy="delete-task-button"]').first().click();
    cy.wait(2000);
    cy.get('[data-cy="dialog-confirm-button"]').click();
    cy.get('[data-cy="dialog-container"]').should('not.exist');
  });
});
