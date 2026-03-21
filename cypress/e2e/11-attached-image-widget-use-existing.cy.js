import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  expectAttachedImagePreview,
  openConflictDialog,
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Use Existing', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('uses the existing image from the conflict dialog', () => {
    setupObjectWidgetDemo();
    openConflictDialog();

    cy.get(`${selectors.modal} .button.secondary`)
      .contains('Use existing')
      .click();

    cy.get(selectors.modal).should('not.exist');
    expectAttachedImagePreview();
  });
});
