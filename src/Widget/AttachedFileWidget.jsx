import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dimmer, Input } from 'semantic-ui-react';
import { readAsDataURL } from 'promise-file-reader';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { Icon, FormFieldWrapper } from '@plone/volto/components';
import loadable from '@loadable/component';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { useSelector } from 'react-redux';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { defineMessages, useIntl, injectIntl } from 'react-intl';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import './style.css';

const Dropzone = loadable(() => import('react-dropzone'));

const messages = defineMessages({
  dragOrUpload: {
    id: 'Drop files here or click to upload',
    defaultMessage: 'Drop files here or click to upload',
  },
  editFile: {
    id: 'Drop files here or click to upload',
    defaultMessage: 'Drop files here or click to upload',
  },
  FilePickerWidgetInputPlaceholder: {
    id: 'Browse the site',
    defaultMessage: 'Browse the site',
  },
});

const FileWidget = (props) => {
  const { id, value, onChange, isDisabled, openObjectBrowser } = props;
  const [nameOfFile, setNameOfFile] = React.useState('');
  const intl = useIntl();
  const [url, setUrl] = React.useState(
    typeof props.value === 'string' ? props.value : '',
  );
  const placeholder =
    props.placeholder ||
    intl.formatMessage(messages.FilePickerWidgetInputPlaceholder);
  const pathname = useSelector((state) => state.router.location.pathname);

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {object} e Event
   * @returns {undefined}
   */
  const onSubmitUrl = () => {
    onChange(id, flattenToAppURL(url));
  };

  const onChangeUrl = ({ target }) => {
    setUrl(target.value);
  };

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  const onDrop = (files) => {
    const file = files[0];
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      onChange(id, {
        data: fields[3],
        encoding: fields[2],
        'content-type': fields[1],
        filename: file.name,
      });
    });
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
  };

  React.useEffect(() => {
    if (typeof value === 'string' && isInternalURL(value)) {
      setNameOfFile(value.split('/').at(-1));
    } else if (value) setNameOfFile(value.filename);
  }, [value]);

  return (
    <FormFieldWrapper {...props}>
      {value !== undefined && value !== null ? (
        <div className="field-file-name">
          {nameOfFile}
          <Button
            icon
            basic
            className="delete-button"
            aria-label="delete file"
            disabled={isDisabled}
            onClick={() => {
              onChange(id, null);
            }}
          >
            <Icon name={deleteSVG} size="20px" />
          </Button>
        </div>
      ) : (
        <>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <>
                <div className="file-widget-dropzone" {...getRootProps()}>
                  {isDragActive && <Dimmer active></Dimmer>}

                  <div className="dropzone-placeholder">
                    <p className="dropzone-text">
                      {intl.formatMessage(messages.dragOrUpload)}
                    </p>
                    <input
                      {...getInputProps({
                        type: 'file',
                        style: { display: 'none' },
                      })}
                      id={`field-${id}`}
                      name={id}
                      type="file"
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </>
            )}
          </Dropzone>
          <div className="file-picker-toolbar">
            <Button
              basic
              icon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openObjectBrowser({
                  mode: 'link',
                  currentPath: pathname,
                  onSelectItem: (url) => {
                    setUrl(url);
                  },
                });
              }}
            >
              <Icon name={navTreeSVG} size="24px" />
            </Button>

            <Input
              className="input-toolbar"
              onChange={onChangeUrl}
              placeholder={placeholder}
              value={url}
            />

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
          </div>
        </>
      )}
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
FileWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  wrapped: PropTypes.bool,
  openObjectBrowser: PropTypes.func.isRequired,
  value: PropTypes.any,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
FileWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
};

export default withObjectBrowser(injectIntl(FileWidget));
