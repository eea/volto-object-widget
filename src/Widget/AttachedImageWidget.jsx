import { isEqual } from 'lodash';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';

import { defineMessages, injectIntl } from 'react-intl';
import isString from 'lodash/isString';
import { Dimmer, Loader, Message, Button, Input } from 'semantic-ui-react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { createContent } from '@plone/volto/actions';
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
    placeholder,
    intl,
  } = props;
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [dragging, setDragging] = useState(false);

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

  const onUploadImage = useCallback(
    (e) => {
      e.stopPropagation();
      const file = e.target.files[0];
      setUploading(true);

      readAsDataURL(file).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);
        createContent(
          getBaseUrl(pathname),
          {
            '@type': 'Image',
            title: file.name,
            image: {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            },
          },
          block,
        );
      });
    },
    [createContent, pathname, block],
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
    (file) => {
      setUploading(true);

      readAsDataURL(file[0]).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);
        createContent(
          getBaseUrl(pathname),
          {
            '@type': 'Image',
            title: file[0].name,
            image: {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file[0].name,
            },
          },
          block,
        );
      });
    },
    [createContent, pathname, block],
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
                    <Loader indeterminate>Uploading image</Loader>
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
  placeholder: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

// Create a memoized version of the component for the default export
const MemoizedAttachedImageWidget = React.memo(
  AttachedImageWidget,
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.value, nextProps.value) &&
      isEqual(prevProps.request, nextProps.request)
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
    }),
    {
      createContent,
    },
  ),
)(MemoizedAttachedImageWidget);
