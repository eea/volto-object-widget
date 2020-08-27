import { ObjectWidget, ObjectListWidget } from './Widgets';

const applyConfig = (config) => {
  config.widgets.widget.object = ObjectWidget;
  config.widgets.widget.object_list = ObjectListWidget;
  return config;
};

// export const installDemo = (config) => {
//   config.block;
// };

export default applyConfig;
