import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  selectors,
  setupObjectWidgetDemo,
  submitAttachedImageUrl,
  typeAttachedImageUrl,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Internal URL', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('submits an internal image URL', () => {
    const internalUrl = '/cypress/my-page/my-Image';

    setupObjectWidgetDemo();
    typeAttachedImageUrl(internalUrl);
    submitAttachedImageUrl();

    cy.get(selectors.previewImage).should(
      'have.attr',
      'src',
      `${internalUrl}/@@images/image/preview`,
    );
  });
});
