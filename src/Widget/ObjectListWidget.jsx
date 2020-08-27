import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Icon,
  Input,
  Label,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon as VoltoIcon } from '@plone/volto/components';

import deleteSVG from '@plone/volto/icons/delete.svg';
import addSVG from '@plone/volto/icons/add.svg';

import ObjectWidget from './ObjectWidget';

import cx from 'classnames';

import { v4 as uuid } from 'uuid';

// TODO: make the ObjectWidget and ObjectListWidget (at least keyboard)
// accessible (e.g. Esc should close the Modal)
// - see: https://github.com/Semantic-Org/Semantic-UI/issues/5053

const messages = defineMessages({
  add: {
    id: 'Add {schemaTitle}',
    defaultMessage: 'Add {schemaTitle}',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  edit: {
    id: 'Edit',
    defaultMessage: 'Edit',
  },
  count: {
    id: 'A collection of {count} items',
    defaultMessage: 'A collection of {count} items',
  },
  emptyListHint: {
    id: 'Click the Add button below to add an item to this empty list.',
    defaultMessage:
      'Click the Add button below to add an item to this empty list.',
  },
});

// TODO: solve issue: having 3 objects in the list and deleting the second throws an error in the browser console
// Possible solution: combine onChange and removeUuid into a single function (method) so that there is no escape for rerendering between these two operations.

export const FlatObjectList = injectIntl(
  ({ id, value = [], schema, onChange, intl, uuids, removeUuid }) => {
    return (
      <div className="objectlist-widget-content">
        {value.map((obj, index) => {
          // here we are using an ID instead of index for React key prop
          // because, in future, the items might be filterable or reorderable
          const k = uuids ? uuids[index] : index;
          return (
            <Grid key={k}>
              <Grid.Column width={11}>
                <Segment>
                  <ObjectWidget
                    id={`${id}-${k}`}
                    key={k}
                    schema={schema}
                    value={obj}
                    onChange={(fi, fv) => {
                      const newvalue = value.map((v, i) =>
                        i !== index ? v : fv,
                      );
                      onChange(id, newvalue);
                    }}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column width={1}>
                <Button.Group>
                  <Button
                    basic
                    circular
                    size="mini"
                    title={intl.formatMessage(messages.delete)}
                    aria-label={intl.formatMessage(messages.delete)}
                    onClick={() => {
                      onChange(
                        id,
                        value.filter((v, i) => i !== index),
                        () => {
                          if (removeUuid) {
                            removeUuid(index);
                          }
                        },
                      );
                    }}
                  >
                    <VoltoIcon size="1.5rem" name={deleteSVG} />
                  </Button>
                </Button.Group>
              </Grid.Column>
            </Grid>
          );
        })}
      </div>
    );
  },
);

export const ModalObjectListForm = injectIntl(
  class ModalObjectListFormBase extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        stateValue: props.value || [],
        uuids: (props.value || []).map(() => uuid()),
      };

      this.modalContentRef = React.createRef(null);
    }

    componentDidMount() {
      if (
        this.modalContentRef.current &&
        this.modalContentRef.current.scrollIntoView
      ) {
        this.modalContentRef.current.scrollIntoView({
          block: 'end',
        });
      }
    }

    createEmpty() {
      return {};
    }

    removeUuid(index, cb) {
      const newUuids = [...this.state.uuids].splice(index, 1);
      this.setState({ uuids: newUuids }, cb);
    }

    addUuid(cb) {
      this.setState({ uuids: [...this.state.uuids, uuid()] }, cb);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({ stateValue: nextProps.value });
    }

    render() {
      const {
        open,
        title,
        className,
        onSave,
        onCancel,
        schema,
        value = [],
        id,
        intl,
      } = this.props;

      let jsx = (
        <Modal open={open} className={className}>
          <Modal.Header>{title}</Modal.Header>
          <Modal.Content scrolling>
            <div ref={this.modalContentRef} data-testid="modal-content">
              {this.state.stateValue.length > 0 ? (
                <FlatObjectList
                  id={id}
                  value={this.state.stateValue}
                  schema={schema}
                  onChange={(id, v, cb) => {
                    this.setState({ stateValue: v }, cb);
                  }}
                  uuids={this.state.uuids}
                  removeUuid={this.removeUuid.bind(this)}
                />
              ) : (
                intl.formatMessage(messages.emptyListHint)
              )}
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              basic
              circular
              floated="left"
              size="big"
              className="icon"
              title={intl.formatMessage(messages.add, {
                schemaTitle: schema.title,
              })}
              aria-label={intl.formatMessage(messages.add, {
                schemaTitle: schema.title,
              })}
              onClick={() => {
                this.addUuid(() => {
                  this.setState({
                    stateValue: [...this.state.stateValue, this.createEmpty()],
                  });
                });
              }}
              style={{ verticalAlign: 'bottom' }}
            >
              <VoltoIcon
                size="1.5rem"
                name={addSVG}
                style={{ verticalAlign: 'bottom' }}
              />
              Add {schema.title}
            </Button>

            <Button
              basic
              circular
              primary
              floated="right"
              icon="arrow right"
              title={intl.formatMessage(messages.save)}
              aria-label={intl.formatMessage(messages.save)}
              size="big"
              onClick={() => {
                onSave(id, this.state.stateValue);
              }}
            />
            <Button
              basic
              circular
              secondary
              icon="remove"
              title={intl.formatMessage(messages.cancel)}
              aria-label={intl.formatMessage(messages.cancel)}
              floated="right"
              size="big"
              onClick={() => {
                this.setState({ stateValue: [...value] }, () => {
                  onCancel();
                });
              }}
            />
          </Modal.Actions>
        </Modal>
      );

      return jsx;
    }
  },
);

export const ObjectListWidget = injectIntl(
  (props) => {
    const {
      id,
      value = [],
      schema,
      onChange,
      required,
      error,
      fieldSet,
      title,
      description,
      intl,
    } = props;

    const [open, setOpen] = useState(false);
    const [isJustChanged, setIsJustChanged] = useState(false);

    return (
      <>
        <ModalObjectListForm
          id={id}
          schema={schema}
          title={title}
          value={value}
          open={open}
          onSave={(id, val) => {
            onChange(id, val);
            setOpen(false);
            setIsJustChanged(true);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Form.Field
          onClick={(e) => {
            e.preventDefault();
          }}
          inline
          required={required}
          error={(error || []).length > 0}
          className={cx('text', {
            help: description,
            'field-just-changed': isJustChanged,
          })}
          id={`${fieldSet || 'field'}-${id}`}
        >
          <Grid>
            <Grid.Row stretched>
              <Grid.Column width="4">
                <div className="wrapper">
                  <label htmlFor={`field-${id}`}>{title}</label>
                </div>
              </Grid.Column>
              <Grid.Column width="8">
                <Input
                  id={`field-${id}`}
                  name={id}
                  disabled={true}
                  value={intl.formatMessage(messages.count, {
                    count: value.length,
                  })}
                />

                <div className="toolbar">
                  <Button
                    aria-label={intl.formatMessage(messages.edit)}
                    title={intl.formatMessage(messages.edit)}
                    className="item ui noborder button"
                    data-testid="big-pen-button"
                    onClick={() => {
                      setIsJustChanged(false);
                      setOpen(true);
                    }}
                  >
                    <Icon name="write square" size="large" color="blue" />
                  </Button>
                  <Button
                    aria-label={intl.formatMessage(messages.delete)}
                    title={intl.formatMessage(messages.delete)}
                    className="item ui noborder button"
                    onClick={() => {
                      onChange(id, []);
                    }}
                  >
                    <Icon name="close" size="large" color="red" />
                  </Button>
                </div>

                {map(error, (message) => (
                  <Label key={message} basic color="red" pointing>
                    {message}
                  </Label>
                ))}
              </Grid.Column>
            </Grid.Row>
            {description && (
              <Grid.Row stretched>
                <Grid.Column stretched width="12">
                  <p className="help">{description}</p>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        </Form.Field>
      </>
    );
  },
  { forwardRef: true },
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ObjectListWidget.propTypes = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  error: PropTypes.any,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  fieldSet: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ObjectListWidget.defaultProps = {
  value: [],
};

export default ObjectListWidget;
