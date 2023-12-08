import {
  AttachedImageWidget,
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
  AttachedFileWidget,
  ObjectTypesWidget,
  UrlWidget,
  InternalUrlWidget,
} from './Widget';

export {
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
  ObjectTypesWidget,
  AttachedFileWidget,
} from './Widget';

export { default as installDemo } from './demo';

const applyConfig = (config) => {
  if (config.widgets?.widget) {
    config.widgets.widget.object_list_popup = ObjectListWidget;
    config.widgets.widget.object_list_inline = ObjectListInlineWidget;
    config.widgets.widget.object_by_type = ObjectByTypeWidget;
    config.widgets.widget.option_mapping = MappingWidget;
    config.widgets.widget.attachedimage = AttachedImageWidget;
    config.widgets.widget.attachedfile = AttachedFileWidget;
    config.widgets.widget.object_types_widget = ObjectTypesWidget;
    config.widgets.widget.url = UrlWidget;
    config.widgets.widget.internal_url = InternalUrlWidget;
  }

  return config;
};

export default applyConfig;
