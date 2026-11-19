import demoConfig from '@eeacms/volto-object-widget/demo';

import config from '@plone/volto/registry';

describe('demoBlock', () => {
  it('registers without crashing', () => {
    const result = demoConfig(config);
    expect(result).toBeTruthy();
  });
  it('has demo block', () => {
    const BLOCK = 'ObjectWidgetDemo';
    const result = demoConfig(config);
    expect(result.blocks.blocksConfig[BLOCK].id).toBe(BLOCK);
  });
});
