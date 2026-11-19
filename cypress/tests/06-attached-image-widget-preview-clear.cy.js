import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  clearAttachedImagePreview,
  expectAttachedImagePreview,
  setupObjectWidgetDemo,
  selectors,
  uploadAttachedImageFixture,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Preview Clear', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('clears the preview after uploading an image', () => {
    setupObjectWidgetDemo();
    uploadAttachedImageFixture();
    expectAttachedImagePreview();

    clearAttachedImagePreview();

    cy.get(`${selectors.field} .preview`).should('not.exist');
    cy.get(selectors.emptyState).should('be.visible');
  });
});
