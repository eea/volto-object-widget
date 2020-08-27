import { ObjectWidget, ObjectListWidget } from './Widget';
export installDemo from './demo';

const applyConfig = (config) => {
  config.widgets.widget.object = ObjectWidget;
  config.widgets.widget.object_list = ObjectListWidget;
  return config;
};

export default applyConfig;
