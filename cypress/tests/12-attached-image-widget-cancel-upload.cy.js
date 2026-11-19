import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  openConflictDialog,
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Cancel Upload', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('cancels the conflicting upload and returns to the empty state', () => {
    setupObjectWidgetDemo();
    openConflictDialog();

    cy.get(`${selectors.modal} .button`).contains('Cancel').click();

    cy.get(selectors.modal).should('not.exist');
    cy.get(selectors.emptyState).should('be.visible');
    cy.get(`${selectors.field} .preview`).should('not.exist');
  });
});
