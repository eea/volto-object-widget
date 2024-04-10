import codeSVG from '@plone/volto/icons/code.svg';

import DemoBlockView from './BlockView';
import DemoBlockEdit from './BlockEdit';

const BLOCK = 'ObjectWidgetDemo';

// eslint-disable-next-line import/no-anonymous-default-export
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
