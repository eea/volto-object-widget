export const selectors = {
  titleField: '.block.inner.title [contenteditable="true"]',
  blockAddButton: '.ui.basic.icon.button.block-add-button',
  blockChooserSearch:
    ".blocks-chooser .ui.form .field.searchbox input[type='text']",
  objectWidgetButton: '.button.ObjectWidgetDemo',
  objectWidgetBlock: '.block.ObjectWidgetDemo',
  objectWidgetBlockInner: '.block.inner.ObjectWidgetDemo',
  field: '.field-attached-image',
  urlInput: '.field-attached-image input[placeholder*="Browse the site"]',
  submitButton: '.field-attached-image .button.primary',
  previewImage: '.field-attached-image .preview img',
  previewClearButton: '.field-attached-image .preview .button.cancel',
  uploadInput: '.field-attached-image .message input[type="file"]',
  emptyState: '.field-attached-image .message',
  loadingDimmer: '.field-attached-image .dimmer.active',
  loader: '.field-attached-image .loader',
  objectListing: '.object-listing',
  modal: '.ui.modal',
};

export const setupObjectWidgetDemo = () => {
  cy.get(selectors.titleField).clear();
  cy.get(selectors.titleField).type('AttachedImageWidget Comprehensive Test');
  cy.get(selectors.titleField).type('{enter}');

  cy.get(selectors.blockAddButton).first().click();
  cy.get(selectors.blockChooserSearch).type('ObjectWidget');
  cy.get(selectors.objectWidgetButton)
    .contains('ObjectWidget Demo')
    .click({ force: true });

  cy.get(selectors.objectWidgetBlock).should('be.visible');
};

export const typeAttachedImageUrl = (url) => {
  cy.get(selectors.urlInput).type(url);
};

export const submitAttachedImageUrl = () => {
  cy.get(selectors.submitButton).click();
};

export const uploadAttachedImageFixture = (fixture = 'image.png') => {
  cy.get(selectors.uploadInput).attachFile(fixture);
};

export const expectAttachedImagePreview = (timeout = 15000) => {
  cy.get(selectors.previewImage, { timeout }).should('be.visible');
};

export const clearAttachedImagePreview = () => {
  cy.get(selectors.previewClearButton).click();
};

export const openAttachedImageObjectBrowser = () => {
  cy.get(`${selectors.field} .button`).first().click();
};

export const saveAndReopenObjectWidgetDemo = () => {
  cy.get('#toolbar-save').click();
  cy.visit('/cypress/my-page/edit');
  cy.waitForResourceToLoad('my-page');
  cy.get(selectors.objectWidgetBlockInner).should('be.visible').click();
};

export const openConflictDialog = () => {
  uploadAttachedImageFixture();
  expectAttachedImagePreview();
  saveAndReopenObjectWidgetDemo();
  clearAttachedImagePreview();
  uploadAttachedImageFixture();
  cy.get(selectors.modal, { timeout: 10000 }).should('be.visible');
};
