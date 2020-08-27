import React from 'react';
import { Tab } from 'semantic-ui-react';
import Field from '../Form/Field';
import PropTypes from 'prop-types';

const FieldSet = ({ data, index, schema, value, errors, onChange, id }) => {
  return data.fields.map((field, idx) => {
    const myIndex = idx;
    const str = `${field}-${myIndex}-${id}`;
    console.log('FIELDSET INDEX', str);
    return (
      <Field
        {...schema.properties[field]}
        // TODO: putting fieldsetIndex in this expression makes the form not
        // work (can't type in it)
        id={str}
        fieldset={data.title.toLowerCase()}
        value={value?.[field]}
        required={schema.required.indexOf(field) !== -1}
        onChange={(field2, fieldvalue) => {
          return onChange(id, { ...value, [field]: fieldvalue });
        }}
        key={field}
        error={errors?.[field]}
        title={schema.properties[field].title}
      />
    );
  });
};

const MyTabPane = ({
  fieldSetData,
  index,
  schema,
  errors,
  value,
  onChange,
  id,
}) => {
  return (
    <Tab.Pane>
      <FieldSet
        data={fieldSetData}
        index={index}
        schema={schema}
        errors={errors}
        value={value}
        onChange={onChange}
        id={id}
      />
    </Tab.Pane>
  );
};

const ObjectWidget = ({
  schema,
  value, // not checked to not contain unknown fields
  onChange,
  errors = {},
  id,
  ...props
}) => {
  const createTab = React.useCallback(
    (fieldset, index) => {
      return {
        menuItem: fieldset.title,
        render: () => (
          <MyTabPane
            errors={errors}
            fieldSetData={fieldset}
            index={index}
            onChange={onChange}
            schema={schema}
            value={value}
            id={id}
          />
        ),
      };
    },
    [errors, id, onChange, schema, value],
  );

  return schema.fieldsets.length === 1 ? (
    <FieldSet
      data={schema.fieldsets[0]}
      index={0}
      schema={schema}
      errors={errors}
      value={value}
      onChange={onChange}
      id={id}
    />
  ) : (
    <Tab panes={schema.fieldsets.map(createTab)} /> // lazy loading
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ObjectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  errors: PropTypes.object,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ObjectWidget.defaultProps = {};

export default ObjectWidget;
