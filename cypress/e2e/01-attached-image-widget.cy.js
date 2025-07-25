import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('AttachedImageWidget - Comprehensive Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  const setupObjectWidgetDemo = () => {
    // Setup page
    cy.get('[contenteditable=true]').first().clear();
    cy.get('[contenteditable=true]')
      .first()
      .type('AttachedImageWidget Comprehensive Test');
    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add ObjectWidgetDemo block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.content.active .button.ObjectWidgetDemo')
      .contains('ObjectWidget Demo')
      .click();

    // Wait for the block to be created
    cy.get('.block.ObjectWidgetDemo').should('be.visible');
  };

  describe('URL Input Functionality', () => {
    it('should handle external URL input and submission', () => {
      setupObjectWidgetDemo();

      // Type external URL
      const externalUrl = 'https://example.com/image.jpg';
      cy.get(
        '.field-attached-image input[placeholder*="Browse the site"]',
      ).type(externalUrl);

      // Submit URL
      cy.get('.field-attached-image .button.primary').click();

      // Verify URL was set (should show in input)
      cy.get('.field-attached-image img').should(
        'have.attr',
        'src',
        externalUrl,
      );
    });

    it('should handle internal URL input and submission', () => {
      setupObjectWidgetDemo();

      // Type internal URL (to existing image)
      const internalUrl = '/cypress/my-page/my-Image';
      cy.get(
        '.field-attached-image input[placeholder*="Browse the site"]',
      ).type(internalUrl);

      // Submit URL
      cy.get('.field-attached-image .button.primary').click();

      // Verify URL was processed
      cy.get('.field-attached-image img').should(
        'have.attr',
        'src',
        internalUrl + '/@@images/image/preview',
      );
    });

    it('should clear URL input when cancel button is clicked', () => {
      setupObjectWidgetDemo();

      // Type URL
      cy.get(
        '.field-attached-image input[placeholder*="Browse the site"]',
      ).type('https://example.com/test.jpg');

      // Click cancel button
      cy.get('.field-attached-image .button.cancel').click();

      // Verify input is cleared
      cy.get(
        '.field-attached-image input[placeholder*="Browse the site"]',
      ).should('have.value', '');
    });

    it('should disable submit button when no URL is entered', () => {
      setupObjectWidgetDemo();

      // Verify submit button is disabled initially
      cy.get('.field-attached-image .button.primary').should('be.disabled');

      // Type URL
      cy.get(
        '.field-attached-image input[placeholder*="Browse the site"]',
      ).type('https://example.com/test.jpg');

      // Verify submit button is enabled
      cy.get('.field-attached-image .button.primary').should('not.be.disabled');
    });
  });

  describe('Object Browser Integration', () => {
    it('should select image from object browser', () => {
      setupObjectWidgetDemo();

      // Click browse button
      cy.get('.field-attached-image .button').first().click();

      // Wait for object browser and navigate to select existing image
      cy.get('.object-listing', { timeout: 10000 }).should('be.visible');

      // Navigate to the existing image (this may need adjustment based on actual browser structure)
      cy.get('.object-listing li').contains('My Image').dblclick();

      // Select the image
      cy.get('.field-attached-image .ui.primary.button').click();

      // Verify image was selected (should show preview)
      cy.get('.field-attached-image .preview img', { timeout: 10000 }).should(
        'be.visible',
      );
    });
  });

  describe('Image Preview and Management', () => {
    it('should show preview when image is selected and allow clearing', () => {
      setupObjectWidgetDemo();

      // Upload an image first
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Wait for upload and preview
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );

      // Click clear button in preview
      cy.get('.field-attached-image .preview .button.cancel').click();

      // Verify preview is removed and upload area is shown again
      cy.get('.field-attached-image .preview').should('not.exist');
      cy.get('.field-attached-image .message').should('be.visible');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during file upload', () => {
      setupObjectWidgetDemo();

      // Start file upload
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Verify loading state appears
      cy.get('.field-attached-image .dimmer.active', { timeout: 1000 }).should(
        'be.visible',
      );
      cy.get('.field-attached-image .loader').should('be.visible');

      // Wait for upload to complete
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
    });

    it('should show dragging state during drag operations', () => {
      setupObjectWidgetDemo();

      // Simulate drag enter
      cy.get('.field-attached-image .ui.message').selectFile(
        'cypress/fixtures/image.png',
        {
          action: 'drag-drop',
        },
      );

      // Verify dragging state (dimmer should be active)
      cy.get('.field-attached-image .dimmer.active').should('be.visible');

      // Simulate drag leave
      cy.get('.field-attached-image .ui.message').trigger('dragleave');

      // Verify dragging state is removed
      cy.get('.field-attached-image .dimmer.active').should('not.exist');
    });
  });

  describe('Image Conflict Resolution', () => {
    it('should show conflict dialog when uploading image with existing name', () => {
      setupObjectWidgetDemo();

      // First, upload an image to create a conflict scenario
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Wait for first upload to complete
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );

      // Save the page to persist the image
      cy.get('#toolbar-save').click();
      cy.visit('/cypress/my-page/edit');
      cy.waitForResourceToLoad('my-page');
      cy.get('.block.inner.ObjectWidgetDemo').should('be.visible').click();
      // Clear the current image to prepare for conflict test
      cy.get('.field-attached-image .preview .button.cancel').click();

      // Upload the same image again (should trigger conflict)
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Verify conflict modal appears
      cy.get('.ui.modal', { timeout: 10000 }).should('be.visible');
      cy.get('.ui.modal .header').should('contain', 'already exists');
    });

    it('should replace existing image when "Replace existing" is clicked', () => {
      setupObjectWidgetDemo();

      // Upload initial image
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
      cy.get('#toolbar-save').click();
      cy.visit('/cypress/my-page/edit');
      cy.waitForResourceToLoad('my-page');
      cy.get('.block.inner.ObjectWidgetDemo').should('be.visible').click();

      // Clear and upload same image again
      cy.get('.field-attached-image .preview .button.cancel').click();
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Wait for conflict modal and click "Replace existing"
      cy.get('.ui.modal', { timeout: 10000 }).should('be.visible');
      cy.get('.ui.modal .button.primary').contains('Replace existing').click();

      // Verify image is uploaded and modal is closed
      cy.get('.ui.modal').should('not.exist');
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
    });

    it('should use existing image when "Use existing" is clicked', () => {
      setupObjectWidgetDemo();

      // Upload initial image
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
      cy.get('#toolbar-save').click();
      cy.visit('/cypress/my-page/edit');
      cy.waitForResourceToLoad('my-page');
      cy.get('.block.inner.ObjectWidgetDemo').should('be.visible').click();

      // Clear and upload same image again
      cy.get('.field-attached-image .preview .button.cancel').click();
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Wait for conflict modal and click "Use existing"
      cy.get('.ui.modal', { timeout: 10000 }).should('be.visible');
      cy.get('.ui.modal .button.secondary').contains('Use existing').click();

      // Verify existing image is used and modal is closed
      cy.get('.ui.modal').should('not.exist');
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
    });

    it('should cancel upload when "Cancel" is clicked in conflict dialog', () => {
      setupObjectWidgetDemo();

      // Upload initial image
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );
      cy.get('.field-attached-image .preview img', { timeout: 15000 }).should(
        'be.visible',
      );
      cy.get('#toolbar-save').click();
      cy.visit('/cypress/my-page/edit');
      cy.waitForResourceToLoad('my-page');
      cy.get('.block.inner.ObjectWidgetDemo').should('be.visible').click();

      // Clear and upload same image again
      cy.get('.field-attached-image .preview .button.cancel').click();
      cy.get('.field-attached-image .message input[type="file"]').attachFile(
        'image.png',
      );

      // Wait for conflict modal and click "Cancel"
      cy.get('.ui.modal', { timeout: 10000 }).should('be.visible');
      cy.get('.ui.modal .button').contains('Cancel').click();

      // Verify modal is closed and no image is shown
      cy.get('.ui.modal').should('not.exist');
      cy.get('.field-attached-image .message').should('be.visible');
      cy.get('.field-attached-image .preview').should('not.exist');
    });
  });
});
