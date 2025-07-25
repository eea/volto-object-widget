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
import { default as installDemo } from './demo';

export {
  ObjectListWidget,
  ObjectListInlineWidget,
  ObjectByTypeWidget,
  MappingWidget,
  ObjectTypesWidget,
  AttachedFileWidget,
} from './Widget';

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

  if (process.env.RAZZLE_CI) {
    return installDemo(config);
  }

  return config;
};

// due to bug with plone/scripts before 18 we can't load addon profiles
// when we switch to volto 18 we can remove the condition above and
// uncomment the line below to install the demo block in cypress testing
// export const cypressTesting = (config) => {
//   return installDemo(config);
// };

export default applyConfig;
