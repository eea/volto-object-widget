import { isEqual } from 'lodash';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';

import { defineMessages, injectIntl } from 'react-intl';
import isString from 'lodash/isString';
import {
  Dimmer,
  Loader,
  Message,
  Button,
  Input,
  Modal,
  Header,
} from 'semantic-ui-react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { createContent, searchContent } from '@plone/volto/actions';
import {
  flattenHTMLToAppURL,
  flattenToAppURL,
  isInternalURL,
  getBaseUrl,
} from '@plone/volto/helpers';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';

import './style.css';

const Dropzone = loadable(() => import('react-dropzone'));

const messages = defineMessages({
  AttachedImageWidgetInputPlaceholder: {
    id: 'Browse the site, drop an image, or type an URL',
    defaultMessage: 'Browse the site, drop an image, or type an URL',
  },
  imageExistsWarning: {
    id: 'image already exists',
    defaultMessage: 'An image with this name already exists in this location.',
  },
  imageExistsQuestion: {
    id: 'What would you like to do?',
    defaultMessage: 'What would you like to do?',
  },
  replaceExisting: {
    id: 'Replace existing image',
    defaultMessage: 'Replace existing image',
  },
  useExisting: {
    id: 'Use existing image',
    defaultMessage: 'Use existing image',
  },
  existingImage: {
    id: 'Existing image:',
    defaultMessage: 'Existing image:',
  },
  uploadingImage: {
    id: 'Uploading image...',
    defaultMessage: 'Uploading image...',
  },
  location: {
    id: 'Location:',
    defaultMessage: 'Location:',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
});

// Define the component without memo for named export (for testing)
export const AttachedImageWidget = (props) => {
  const {
    id,
    title,
    value,
    block,
    request,
    pathname,
    onChange,
    openObjectBrowser,
    selectedItemAttrs,
    content,
    createContent,
    searchContent,
    searchResults,
    placeholder,
    intl,
  } = props;
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showExistsWarning, setShowExistsWarning] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [pendingImageData, setPendingImageData] = useState(null);
  const [checkingExists, setCheckingExists] = useState(false);

  // Handle content upload completion
  useEffect(() => {
    if (request.loading && !uploading) return;

    if (!request.loading && request.loaded && uploading) {
      setUploading(false);

      if (selectedItemAttrs && content) {
        const allowedItemKeys = [...selectedItemAttrs, 'title'];
        const resultantItem = Object.keys(content)
          .filter((key) => allowedItemKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = content[key];
            return obj;
          }, {});

        const finalItem = {
          ...resultantItem,
          '@id': flattenToAppURL(content['@id']),
          image_field: 'image',
        };

        onChange(id, [finalItem]);
      } else if (content) {
        onChange(id, [
          {
            '@id': flattenToAppURL(content['@id']),
            image_field: 'image',
            title: content.title,
          },
        ]);
      }
    }
  }, [
    request.loading,
    request.loaded,
    uploading,
    selectedItemAttrs,
    content,
    onChange,
    id,
  ]);

  // Check if a image with the same name exists in the current folder
  const checkImageExists = useCallback(
    (filename) => {
      const baseUrl = getBaseUrl(pathname);
      const searchKey = `image-exists-check-${block}`;

      // Search for images with the exact filename in the current folder
      searchContent(
        baseUrl,
        {
          portal_type: 'Image',
          'path.depth': 1, // Only direct children
          id: `${filename}`, // Exact match with quotes
        },
        searchKey,
      );

      setCheckingExists(true);
    },
    [searchContent, pathname, block],
  );

  // Function to proceed with upload after checks
  const proceedWithUpload = useCallback(
    (imageData) => {
      if (!imageData) return;

      // Set uploading state to true so the upload completion logic works
      setUploading(true);

      createContent(
        getBaseUrl(pathname),
        {
          '@type': 'Image',
          title: imageData.filename,
          image: {
            data: imageData.data,
            encoding: imageData.encoding,
            'content-type': imageData.contentType,
            filename: imageData.filename,
          },
        },
        block,
      );

      // Clear pending image data
      setPendingImageData(null);
    },
    [createContent, pathname, block],
  );

  // Handle search results for image existence check
  useEffect(() => {
    const searchKey = `image-exists-check-${block}`;
    const searchResult = searchResults?.[searchKey];

    if (
      searchResult?.loaded &&
      !searchResult.loading &&
      checkingExists &&
      pendingImageData
    ) {
      setCheckingExists(false);

      const items = searchResult.items || [];

      // Look for exact filename match
      const existingImage = items.find((item) => {
        // Check if the filename matches exactly
        const itemFilename = item.image?.filename || item.title;
        return itemFilename === pendingImageData.filename;
      });

      if (existingImage) {
        // image exists, show warning dialog
        setExistingImage(existingImage);
        setShowExistsWarning(true);
        setUploading(false);
      } else {
        // image doesn't exist, proceed with upload
        proceedWithUpload(pendingImageData);
      }
    }
  }, [
    searchResults,
    block,
    checkingExists,
    pendingImageData,
    proceedWithUpload,
  ]);

  // Function to use existing image
  const useExistingImage = useCallback(() => {
    if (existingImage) {
      onChange(id, [
        {
          '@id': flattenToAppURL(existingImage['@id']),
          image_field: 'image',
          title: existingImage.title,
        },
      ]);

      // Reset state
      setShowExistsWarning(false);
      setExistingImage(null);
      setPendingImageData(null);
      setUploading(false);
    }
  }, [existingImage, onChange, id]);

  // Function to cancel the upload
  const cancelUpload = useCallback(() => {
    setShowExistsWarning(false);
    setExistingImage(null);
    setPendingImageData(null);
    setUploading(false);
  }, []);

  const onUploadImage = useCallback(
    (e) => {
      e.stopPropagation();
      const image = e.target.files[0];
      setUploading(true);

      readAsDataURL(image).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);

        // Store image data for potential later use
        setPendingImageData({
          filename: image.name,
          data: fields[3],
          encoding: fields[2],
          contentType: fields[1],
        });

        // Check if image exists
        checkImageExists(image.name);
      });
    },
    [checkImageExists],
  );

  const onChangeUrl = useCallback(({ target }) => {
    setUrl(flattenToAppURL(target.value));
  }, []);

  const onSubmitUrl = useCallback(() => {
    if (isString(url)) {
      onChange(id, [
        {
          '@id': flattenToAppURL(url),
          ...(isInternalURL(url) ? { image_field: 'image' } : {}),
        },
      ]);
    } else {
      onChange(id, [
        {
          ...(url || {}),
        },
      ]);
    }
  }, [url, onChange, id]);

  const resetSubmitUrl = useCallback(() => {
    setUrl('');
    onChange(id, '');
  }, [onChange, id]);

  const onDrop = useCallback(
    (image) => {
      setUploading(true);
      setDragging(false);

      readAsDataURL(image[0]).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);

        // Store image data for potential later use
        setPendingImageData({
          filename: image[0].name,
          data: fields[3],
          encoding: fields[2],
          contentType: fields[1],
        });

        // Check if image exists
        checkImageExists(image[0].name);
      });
    },
    [checkImageExists],
  );

  const onDragEnter = useCallback(() => {
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const onItemChange = useCallback(
    (_id, itemUrl, item) => {
      let resultantItem = item;
      if (selectedItemAttrs) {
        const allowedItemKeys = [...selectedItemAttrs, 'title'];
        resultantItem = Object.keys(item)
          .filter((key) => allowedItemKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
        resultantItem = { ...resultantItem, '@id': flattenToAppURL(itemUrl) };
        setUrl(resultantItem);
      } else {
        setUrl(resultantItem || flattenToAppURL(itemUrl));
      }
    },
    [selectedItemAttrs],
  );

  const currentPlaceholder = useMemo(
    () =>
      placeholder ||
      intl.formatMessage(messages.AttachedImageWidgetInputPlaceholder),
    [placeholder, intl],
  );

  const imageSrc = useMemo(
    () => getImageScaleParams(value, 'preview') ?? '',
    [value],
  );

  return (
    <FormFieldWrapper columns={1} className="field-attached-image" {...props}>
      <div className="wrapper">
        <label>{title}</label>
      </div>

      {/* image exists warning modal */}
      <Modal open={showExistsWarning} size="small">
        <Header content={intl.formatMessage(messages.imageExistsWarning)} />
        <Modal.Content>
          <p>{intl.formatMessage(messages.imageExistsQuestion)}</p>
          {existingImage && (
            <>
              <p>
                <strong>{intl.formatMessage(messages.existingImage)}</strong>{' '}
                {existingImage.title}
              </p>

              <p>
                <strong>{intl.formatMessage(messages.location)}</strong>{' '}
                {flattenToAppURL(existingImage['@id'])}
              </p>
              <img
                src={`${flattenToAppURL(
                  existingImage['@id'],
                )}/@@images/image/thumb`}
                alt=""
              />
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            onClick={() => {
              setShowExistsWarning(false);
              setExistingImage(null);
              proceedWithUpload(pendingImageData);
            }}
          >
            {intl.formatMessage(messages.replaceExisting)}
          </Button>
          <Button secondary onClick={useExistingImage}>
            {intl.formatMessage(messages.useExisting)}
          </Button>
          <Button onClick={cancelUpload}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        </Modal.Actions>
      </Modal>

      {imageSrc && imageSrc.download && (
        <div className="preview">
          <img src={imageSrc?.download ?? imageSrc?.['@id']} alt="Preview" />
          <Button.Group>
            <Button
              basic
              icon
              className="cancel"
              onClick={(e) => {
                e.stopPropagation();
                resetSubmitUrl();
              }}
            >
              <Icon name={clearSVG} size="30px" />
            </Button>
          </Button.Group>
        </div>
      )}
      {!imageSrc?.download && (
        <Dropzone
          noClick
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className="dropzone"
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <Message>
                {dragging && <Dimmer active></Dimmer>}
                {uploading && (
                  <Dimmer active>
                    <Loader indeterminate>
                      {intl.formatMessage(messages.uploadingImage)}
                    </Loader>
                  </Dimmer>
                )}
                <div
                  className="no-image-wrapper"
                  style={{ textAlign: 'center' }}
                >
                  <img src={imageBlockSVG} alt="" />
                  <div className="toolbar-inner">
                    <Button.Group>
                      <Button
                        basic
                        icon
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openObjectBrowser({
                            mode: 'image',
                            currentPath: pathname,
                            onSelectItem: (
                              itemUrl,
                              { title: itemTitle, image_field, image_scales },
                            ) => {
                              onItemChange(id, flattenHTMLToAppURL(itemUrl), {
                                '@id': flattenHTMLToAppURL(itemUrl),
                                title: itemTitle,
                                image_field,
                                image_scales,
                              });
                            },
                          });
                        }}
                      >
                        <Icon name={navTreeSVG} size="24px" />
                      </Button>
                      <Button as="label" basic icon>
                        <Icon name={uploadSVG} size="24px" />
                        <input
                          {...getInputProps({
                            type: 'file',
                            onChange: onUploadImage,
                            style: { display: 'none' },
                          })}
                        />
                      </Button>
                    </Button.Group>
                    <div style={{ flexGrow: 1 }} />
                    <Input
                      onChange={onChangeUrl}
                      placeholder={currentPlaceholder}
                      value={isString(url) ? url : url?.['@id'] || ''}
                    />
                    <div style={{ flexGrow: 1 }} />
                    <Button.Group>
                      {url && (
                        <Button
                          basic
                          icon
                          secondary
                          className="cancel"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetSubmitUrl();
                          }}
                        >
                          <Icon name={clearSVG} size="24px" />
                        </Button>
                      )}
                      <Button
                        basic
                        icon
                        primary
                        disabled={!url}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubmitUrl();
                        }}
                      >
                        <Icon name={aheadSVG} size="24px" />
                      </Button>
                    </Button.Group>
                  </div>
                </div>
              </Message>
            </div>
          )}
        </Dropzone>
      )}
    </FormFieldWrapper>
  );
};

// PropTypes for the component
AttachedImageWidget.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]),
  block: PropTypes.string.isRequired,
  request: PropTypes.shape({
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  openObjectBrowser: PropTypes.func.isRequired,
  selectedItemAttrs: PropTypes.array,
  content: PropTypes.object,
  createContent: PropTypes.func.isRequired,
  searchContent: PropTypes.func.isRequired,
  searchResults: PropTypes.object,
  placeholder: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

// Create a memoized version of the component for the default export
const MemoizedAttachedImageWidget = React.memo(
  AttachedImageWidget,
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.value, nextProps.value) &&
      isEqual(prevProps.request, nextProps.request) &&
      isEqual(prevProps.searchResults, nextProps.searchResults)
    );
  },
);

export default compose(
  injectIntl,
  withObjectBrowser,
  connect(
    (state, props) => ({
      pathname: state.router.location.pathname,
      request: state.content.subrequests[props.block] || {},
      content: state.content.subrequests[props.block]?.data,
      searchResults: state.search.subrequests || {},
    }),
    {
      createContent,
      searchContent,
    },
  ),
)(MemoizedAttachedImageWidget);
