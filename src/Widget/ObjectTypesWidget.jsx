import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { ObjectWidget } from '@plone/volto/components';
import { connect } from 'react-redux';

const getDeviceConfig = (width) => {
  // semantic ui breakpoints
  if (width < 320) {
    return 'mobile';
  } else if (width >= 320 && width < 768) {
    return 'tablet';
  } else if (width >= 768 && width < 992) {
    return 'computer';
  } else if (width >= 992 && width < 1280) {
    return 'large';
  } else if (width >= 1280) {
    return 'widescreen';
  }
};

export const ObjectTypesWidget = (props) => {
  const {
    schemas,
    value = {},
    onChange,
    errors = {},
    id,
    block,
    screen,
  } = props;
  const objectId = id;

  const defaultActiveTab = 0;

  const [activeTab, setActiveTab] = React.useState(
    defaultActiveTab > -1 ? defaultActiveTab : 0,
  );

  const device = screen?.page?.width
    ? getDeviceConfig(screen?.page?.width)
    : '';

  const createTab = ({ schema, id, icon }, index) => {
    return {
      menuItem: () => (
        <Menu.Item
          onClick={() => setActiveTab(index)}
          active={activeTab === index}
          key={id}
        >
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{schema.title}</p>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane style={{ padding: '0' }}>
            <ObjectWidget
              schema={schema}
              id={id}
              block={block}
              errors={errors}
              value={value[id] || {}}
              onChange={(schemaId, v) => {
                onChange(objectId, { ...value, [schemaId]: v });
              }}
            />
          </Tab.Pane>
        );
      },
    };
  };

  return (
    <Tab
      menu={{
        vertical:
          device === 'computer' || device === 'tablet' || device === 'mobile'
            ? false
            : true,
        tabular: true,
      }}
      panes={schemas.map(createTab)}
      activeIndex={activeTab}
      grid={{ paneWidth: 9, tabWidth: 3 }}
    />
  );
};

export default connect(
  (state, props) => ({
    screen: state?.screen,
  }),
  {},
)(ObjectTypesWidget);
