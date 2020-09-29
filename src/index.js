import {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
} from './Widget';
export {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
} from './Widget';

export installDemo from './demo';

const applyConfig = (config) => {
  config.widgets.widget.object = ObjectWidget;
  config.widgets.widget.object_list = ObjectListWidget;
  config.widgets.widget.object_list_inline = ObjectListInlineWidget;
  return config;
};

export default applyConfig;
