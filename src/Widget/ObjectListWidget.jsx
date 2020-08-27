import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Icon,
  Label,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon as VoltoIcon } from '@plone/volto/components';

import deleteSVG from '@plone/volto/icons/delete.svg';
import addSVG from '@plone/volto/icons/add.svg';

import ObjectWidget from './ObjectWidget';

import cx from 'classnames';

import { v4 as uuid } from 'uuid';

import './style.css';

// TODO: make the ObjectWidget and ObjectListWidget (at least keyboard)
// accessible (e.g. Esc should close the Modal)
// - see: https://github.com/Semantic-Org/Semantic-UI/issues/5053

/**
 * The localizable string messages.
 */
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
    id: 'A collection of <b>{count}</b> items',
    defaultMessage: 'A collection of <b>{count}</b> items',
  },
  emptyListHint: {
    id: 'Click the Add button below to add an item to this empty list.',
    defaultMessage:
      'Click the Add button below to add an item to this empty list.',
  },
});

/**
 * Displays an internationalized list of objects of the same schema, each of them having a Delete button on its right.
 * In future this might also allow filtering, reordering etc.
 * @param {string} id
 * @param {array} value
 * @param {object} schema
 * @param {function} onChange
 * @param {string[]} uuids
 * @param {function} removeUuid
 */
export const FlatObjectList = ({
  id,
  value = [],
  schema,
  onChange,
  uuids,
  removeUuid,
}) => {
  const intl = useIntl();

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
};

/**
 * Custom React hook.
 * @param {React.RefObject} modalContentRef Ref of the element in which to scroll to bottom automatically.
 * @param {object[]} stateValue Scroll automatically also when this parameter's reference changes.
 */
export const useScrollToBottomAutomatically = (modalContentRef, stateValue) => {
  React.useEffect(() => {
    if (modalContentRef.current && modalContentRef.current.scrollIntoView) {
      modalContentRef.current.scrollIntoView({
        block: 'end',
      });
    }
  }, [modalContentRef, stateValue]);
};

export const ModalObjectListForm = (props) => {
  const {
    open,
    title,
    className,
    onSave,
    onCancel,
    schema,
    value = [],
    id,
  } = props;

  const intl = useIntl();

  const [stateValue, setStateValue] = useState(value);
  const [uuids, setUuids] = React.useState(value.map(() => uuid()));
  const modalContentRef = React.useRef(null);

  useScrollToBottomAutomatically(modalContentRef, stateValue);

  const createEmpty = React.useCallback(() => {
    return {};
  }, []);

  const removeUuid = React.useCallback(
    (index) => {
      const newUuids = [...uuids].splice(index, 1);
      setUuids(newUuids);
    },
    [uuids],
  );

  const addUuid = React.useCallback(() => {
    setUuids([...uuids, uuid()]);
  }, [uuids]);

  /**
   * For when `value` is updated outside of the Modal and the Modal is reopened
   * after that. (The current behaviour is that the contents of the reopened
   * Modal are not updated.)
   **/
  React.useEffect(() => {
    setStateValue(value);
  }, [value]);

  let jsx = (
    <Modal open={open} className={className}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content scrolling>
        <div ref={modalContentRef} data-testid="modal-content">
          {stateValue.length > 0 ? (
            <FlatObjectList
              id={id}
              value={stateValue}
              schema={schema}
              onChange={(id, v) => {
                setStateValue(v);
              }}
              uuids={uuids}
              removeUuid={removeUuid}
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
          className="icon with-middle-aligned-icon"
          title={intl.formatMessage(messages.add, {
            schemaTitle: schema.title,
          })}
          aria-label={intl.formatMessage(messages.add, {
            schemaTitle: schema.title,
          })}
          onClick={() => {
            addUuid();
            setStateValue([...stateValue, createEmpty()]);
          }}
        >
          <VoltoIcon size="1.5rem" name={addSVG} />
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
            onSave(id, stateValue);
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
            setStateValue([...value]);
            onCancel();
          }}
        />
      </Modal.Actions>
    </Modal>
  );

  return jsx;
};

export const ObjectListWidget = (props) => {
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
  } = props;

  const intl = useIntl();

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
              <div
                id={`field-${id}`}
                name={id}
                className="field-object-counter"
              >
                {intl.formatMessage(messages.count, {
                  count: value.length,
                  b: (val) => {
                    // `val` is  just `count` written above; w/o those nbsp-s
                    // there is no space on the left or on the right of the
                    // number in the final HTML
                    return <strong>&nbsp;{val}&nbsp;</strong>;
                  },
                })}
              </div>

              <div className="field-toolbar">
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
};

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
