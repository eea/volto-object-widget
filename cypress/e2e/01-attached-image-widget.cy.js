import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Image', () => {
    const titleSelector = '.block.inner.title [contenteditable="true"]';

    // Change page title
    cy.get(titleSelector).clear();
    cy.get(titleSelector).type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get(titleSelector).type('{enter}');

    // Add Image block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'Image',
    );
    cy.get('.button.image').contains('Image').click({ force: true });

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('.block.image');
  });
});
