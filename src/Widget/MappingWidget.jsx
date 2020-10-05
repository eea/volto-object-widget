import React from 'react';
import { Segment } from 'semantic-ui-react';
import { Field } from '@plone/volto/components';

const MappingWidget = (props) => {
  const {
    value, // not checked to not contain unknown fields
    onChange,
    errors = {},
    id,
    title,
    options,
    field_props,
  } = props;
  const mappingWidgetId = id;

  return (
    <div className="mapping-widget">
      <header>{title}</header>
      <Segment>
        {options.map(({ id, title }, i) => {
          const fieldId = `${mappingWidgetId}-${id}`;
          return (
            <Field
              {...field_props}
              title={title}
              id={fieldId}
              formData={value}
              focus={false}
              value={value?.[id]}
              required={false}
              onChange={(_id, _value) => {
                onChange(mappingWidgetId, { ...value, [id]: _value });
              }}
              key={fieldId}
              error={errors[fieldId] || []}
            />
          );
        })}
      </Segment>
    </div>
  );
};

export default MappingWidget;
