import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  expectAttachedImagePreview,
  setupObjectWidgetDemo,
  selectors,
  uploadAttachedImageFixture,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Upload Loading', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('shows a loading state while uploading a file', () => {
    setupObjectWidgetDemo();
    uploadAttachedImageFixture();

    cy.get(selectors.loadingDimmer, { timeout: 1000 }).should('be.visible');
    cy.get(selectors.loader).should('be.visible');

    expectAttachedImagePreview();
  });
});
