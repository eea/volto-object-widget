import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  openConflictDialog,
  setupObjectWidgetDemo,
  selectors,
} from '../support/attachedImageWidget';

describe('AttachedImageWidget - Conflict Dialog', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('shows the conflict dialog when the image already exists', () => {
    setupObjectWidgetDemo();
    openConflictDialog();

    cy.get(`${selectors.modal} .header`).should('contain', 'already exists');
  });
});
