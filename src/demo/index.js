import codeSVG from '@plone/volto/icons/code.svg';

import DemoBlockView from './BlockView';
import DemoBlockEdit from './BlockEdit';

const BLOCK = 'ObjectWidgetDemo';

export default (config) => {
  config.blocks.blocksConfig[BLOCK] = {
    id: BLOCK,
    title: 'ObjectWidget Demo',
    icon: codeSVG,
    group: 'text',
    view: DemoBlockView,
    edit: DemoBlockEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};
