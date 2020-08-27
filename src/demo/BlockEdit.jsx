import React from 'react';
import BlockView from './BlockView';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { CombinedSchema } from './schema.js';

export default (props) => {
  const [data, setData] = React.useState({});
  return (
    <div
      role="presentation"
      className="block selected"
      onClick={() => {
        props.onSelectBlock(props.block);
      }}
    >
      <div className="block-inner-wrapper">
        <BlockView {...props} properties={{}} />
      </div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={CombinedSchema}
          title={CombinedSchema.title}
          onChangeField={(id, value) => {
            setData({
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          block={props.block}
        />
      </SidebarPortal>
    </div>
  );
};
