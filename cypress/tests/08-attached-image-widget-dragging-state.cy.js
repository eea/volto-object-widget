import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Dragging State', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('shows and clears the dragging state during drag operations', () => {
    setupObjectWidgetDemo();

    cy.get(selectors.emptyState).selectFile('cypress/fixtures/image.png', {
      action: 'drag-drop',
    });

    cy.get(selectors.loadingDimmer).should('be.visible');

    cy.get(selectors.emptyState).trigger('dragleave');

    cy.get(selectors.loadingDimmer).should('not.exist');
  });
});
