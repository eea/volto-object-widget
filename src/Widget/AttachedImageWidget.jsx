import { isEqual } from 'lodash';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';

import { defineMessages, injectIntl } from 'react-intl';
import { Dimmer, Loader, Message, Button, Input } from 'semantic-ui-react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { createContent } from '@plone/volto/actions';
import {
  flattenToAppURL,
  getBaseUrl,
  isInternalURL,
} from '@plone/volto/helpers';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
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

export class AttachedImageWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.any,
    block: PropTypes.string.isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
  };

  state = {
    uploading: false,
    url: '',
    dragging: false,
  };

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.request.loading &&
      nextProps.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });
      this.props.onChange(this.props.id, nextProps.content['@id']);
    }
  }

  /**
   * @param {*} nextProps
   * @returns {boolean}
   * @memberof Edit
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props.value, nextProps.value) ||
      !isEqual(this.state, nextState)
    );
  }

  /**
   * Upload image handler (not used), but useful in case that we want a button
   * not powered by react-dropzone
   * @method onUploadImage
   * @returns {undefined}
   */
  onUploadImage = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    this.setState({
      uploading: true,
    });
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
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
        this.props.block,
      );
    });
  };

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      url: target.value,
    });
  };

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {object} e Event
   * @returns {undefined}
   */
  onSubmitUrl = () => {
    this.props.onChange(this.props.id, flattenToAppURL(this.state.url));
  };

  resetSubmitUrl = () => {
    this.setState({
      url: '',
    });
  };

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  onDrop = (file) => {
    this.setState({
      uploading: true,
    });

    readAsDataURL(file[0]).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
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
        this.props.block,
      );
    });
  };

  onDragEnter = () => {
    this.setState({ dragging: true });
  };

  onDragLeave = () => {
    this.setState({ dragging: false });
  };

  node = React.createRef();

  render() {
    const placeholder =
      this.props.placeholder ||
      this.props.intl.formatMessage(
        messages.AttachedImageWidgetInputPlaceholder,
      );

    return (
      <FormFieldWrapper
        columns={1}
        className="field-attached-image"
        {...this.props}
      >
        <div className="wrapper">
          <label>{this.props.title}</label>
        </div>
        {this.props.value && (
          <div className="preview">
            <img
              src={
                isInternalURL(this.props.value)
                  ? `${flattenToAppURL(
                      this.props.value,
                    )}/@@images/image/preview`
                  : this.props.value
              }
              alt="Preview"
            />
            <Button.Group>
              <Button
                basic
                icon
                className="cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({ url: '' }, () => {
                    this.onSubmitUrl();
                  });
                }}
              >
                <Icon name={clearSVG} size="30px" />
              </Button>
            </Button.Group>
          </div>
        )}
        {!this.props.value && (
          <Dropzone
            noClick
            onDrop={this.onDrop}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            className="dropzone"
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <Message>
                  {this.state.dragging && <Dimmer active></Dimmer>}
                  {this.state.uploading && (
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
                            this.props.openObjectBrowser({
                              mode: 'image',
                              onSelectItem: (url) => {
                                this.setState({ url });
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
                              onChange: this.onUploadImage,
                              style: { display: 'none' },
                            })}
                          />
                        </Button>
                      </Button.Group>
                      <div style={{ flexGrow: 1 }} />
                      <Input
                        onChange={this.onChangeUrl}
                        placeholder={placeholder}
                        value={this.state.url}
                      />
                      <div style={{ flexGrow: 1 }} />
                      <Button.Group>
                        {this.state.url && (
                          <Button
                            basic
                            icon
                            secondary
                            className="cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              this.setState({ url: '' });
                            }}
                          >
                            <Icon name={clearSVG} size="24px" />
                          </Button>
                        )}
                        <Button
                          basic
                          icon
                          primary
                          disabled={!this.state.url}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.onSubmitUrl();
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
  }
}

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
)(AttachedImageWidget);
