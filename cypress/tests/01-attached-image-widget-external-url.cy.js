import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  selectors,
  setupObjectWidgetDemo,
  submitAttachedImageUrl,
  typeAttachedImageUrl,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - External URL', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('submits an external image URL', () => {
    const externalUrl = 'https://example.com/image.jpg';

    setupObjectWidgetDemo();
    typeAttachedImageUrl(externalUrl);
    submitAttachedImageUrl();

    cy.get(selectors.previewImage).should('have.attr', 'src', externalUrl);
  });
});
