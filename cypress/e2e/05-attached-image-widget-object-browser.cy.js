import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  expectAttachedImagePreview,
  openAttachedImageObjectBrowser,
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Object Browser', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('selects an image from the object browser', () => {
    setupObjectWidgetDemo();
    openAttachedImageObjectBrowser();

    cy.get(selectors.objectListing, { timeout: 10000 }).should('be.visible');
    cy.get('[aria-label="Select My Image"]').dblclick();
    cy.get(selectors.objectListing, { timeout: 10000 }).should('not.exist');
    cy.get(selectors.submitButton).scrollIntoView().click({ force: true });

    expectAttachedImagePreview(10000);
  });
});
