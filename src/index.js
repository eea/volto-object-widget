import {
  AttachedImageWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
} from './Widget';

export {
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
} from './Widget';

export installDemo from './demo';

const applyConfig = (config) => {
  config.widgets.widget.object_list_popup = ObjectListWidget;
  config.widgets.widget.object_list_inline = ObjectListInlineWidget;
  config.widgets.widget.object_by_type = ObjectByTypeWidget;
  config.widgets.widget.option_mapping = MappingWidget;
  config.widgets.widget.attachedimage = AttachedImageWidget;

  return config;
};

export default applyConfig;
