import {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
} from './Widget';

export {
  ObjectWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
} from './Widget';

export installDemo from './demo';

const applyConfig = (config) => {
  config.widgets.widget.object = ObjectWidget;
  config.widgets.widget.object_list = ObjectListWidget;
  config.widgets.widget.object_list_inline = ObjectListInlineWidget;
  config.widgets.widget.object_by_type = ObjectByTypeWidget;
  config.widgets.widget.option_mapping = MappingWidget;

  return config;
};

export default applyConfig;
