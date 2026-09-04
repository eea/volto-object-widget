import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  expectAttachedImagePreview,
  openConflictDialog,
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Replace Existing', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('replaces the existing image from the conflict dialog', () => {
    setupObjectWidgetDemo();
    openConflictDialog();

    cy.get(`${selectors.modal} .button.primary`)
      .contains('Replace existing')
      .click();

    cy.get(selectors.modal).should('not.exist');
    expectAttachedImagePreview();
  });
});
