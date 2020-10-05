import {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
} from './Widget';

export {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
} from './Widget';

export installDemo from './demo';

const applyConfig = (config) => {
  config.widgets.widget.object = ObjectWidget;
  config.widgets.widget.object_list = ObjectListWidget;
  config.widgets.widget.object_list_inline = ObjectListInlineWidget;
  config.widgets.widget.object_by_type = ObjectByTypeWidget;

  return config;
};

export default applyConfig;
