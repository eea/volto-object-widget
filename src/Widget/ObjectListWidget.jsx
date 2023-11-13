import { Input, Button, Grid, Modal, Segment } from 'semantic-ui-react';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Icon as VoltoIcon,
  FormFieldWrapper,
  ObjectWidget,
} from '@plone/volto/components';

import penSVG from '@plone/volto/icons/pen.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import addSVG from '@plone/volto/icons/add.svg';

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
    id: '{count} x {type}',
    defaultMessage: '{count} x {type}',
  },
  emptyListHint: {
    id: 'Click the Add button below to add an item to this empty list.',
    defaultMessage:
      'Click the Add button below to add an item to this empty list.',
  },
});

/**
 * Displays an internationalized list of objects of the same schema, each of
 * them having a Delete button on its right. In future this might also allow
 * filtering, reordering etc.
 * @param {string} id
 * @param {array} value
 * @param {object} schema
 * @param {function} onChange
 * @param {string[]} uuids An array of IDs that are associated to each object in
 * `value` with the same index.
 * @param {function} removeUuid A function that removes the ID passed to it from
 * the lifted-up state data about IDs.
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
                  <VoltoIcon name={deleteSVG} size="18px" />
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
 * @param {React.RefObject} modalContentRef Ref of the element in which to
 * scroll to bottom automatically.
 * @param {object[]} stateValue Scroll automatically also when this parameter's
 * reference changes.
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

/**
 * Internationalized component which renders a modal form with an object list.
 * It retains internal state about the current value of the fields, and a
 * separate array of UUIDs, one for each object. Scrolls to bottom automatically
 * when adding a new object to the list or opening the form.
 * @param {boolean} open
 * @param {string} title
 * @param {string} className
 * @param {function} onSave
 * @param {function} onCancel
 * @param {object} schema
 * @param {object[]} value
 * @param {string} id
 */
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

  // Update again the form state with passed-down value, in case it has been
  // changed outside this component
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

/**
 * Shows a field that is backed by a modal form which shows a list of objects of
 * a specified schema. Shows a visual cue after saving the data in the form to
 * highlight the field whose value was possibly changed.
 * @param {string} id
 * @param {object[]} value
 * @param {object} schema
 * @param {function} onChange
 * @param {boolean} required
 * @param {string[]} error
 * @param {string} title
 * @param {string} description
 */
export const ObjectListWidget = (props) => {
  const {
    id,
    value = [],
    schema,
    onChange,
    onBlur,
    title,
    description,
    placeholder,
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
      <FormFieldWrapper {...props} className="text">
        <Input
          id={`field-${id}`}
          name={id}
          disabled={false}
          value={intl.formatMessage(messages.count, {
            count: value.length,
            type: schema.title,
          })}
          placeholder={placeholder}
          onChange={({ target }) =>
            onChange(id, target.value === '' ? undefined : target.value)
          }
          onBlur={onBlur}
          onClick={() => {
            setIsJustChanged(false);
            setOpen(true);
          }}
          className={cx('text', {
            help: description,
            'field-just-changed': isJustChanged,
          })}
        >
          <input type="text" disabled />
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
            <VoltoIcon name={penSVG} size="18px" color="blue" />
          </Button>
          <Button
            aria-label={intl.formatMessage(messages.delete)}
            title={intl.formatMessage(messages.delete)}
            className="item ui noborder button"
            onClick={() => {
              onChange(id, []);
            }}
          >
            <VoltoIcon name={clearSVG} size="18px" color="red" />
          </Button>
        </Input>
      </FormFieldWrapper>
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
  errors: PropTypes.arrayOf(PropTypes.any),
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
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
