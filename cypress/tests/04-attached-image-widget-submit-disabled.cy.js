import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  selectors,
  setupObjectWidgetDemo,
  typeAttachedImageUrl,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Submit State', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('enables submit only after a URL is entered', () => {
    setupObjectWidgetDemo();

    cy.get(selectors.submitButton).should('be.disabled');

    typeAttachedImageUrl('https://example.com/test.jpg');

    cy.get(selectors.submitButton).should('not.be.disabled');
  });
});
