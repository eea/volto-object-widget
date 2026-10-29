import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  selectors,
  setupObjectWidgetDemo,
  typeAttachedImageUrl,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Clear URL', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('clears the typed URL', () => {
    setupObjectWidgetDemo();
    typeAttachedImageUrl('https://example.com/test.jpg');

    cy.get(`${selectors.field} .button.cancel`).click();

    cy.get(selectors.urlInput).should('have.value', '');
  });
});
