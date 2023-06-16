import React from 'react';
import { Provider } from 'react-intl-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { ObjectTypesWidget } from './ObjectTypesWidget';

jest.mock('@plone/volto/components', () => ({
  ObjectWidget: jest.fn(() => <div>Mock ObjectWidget</div>),
}));

const mockStore = configureStore([]);
const store = mockStore({
  screen: {
    page: {
      width: 768,
    },
  },
  intl: {
    locale: 'en',
    messages: {},
  },
});

const schemas = [
  { schema: { title: 'Schema 1' }, id: 'schema1', icon: 'icon1' },
  { schema: { title: 'Schema 2' }, id: 'schema2', icon: 'icon2' },
];

describe('ObjectTypesWidget', () => {
  it('renders correctly and changes active tab upon click', () => {
    const { rerender } = render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 768,
            },
          }}
        />
      </Provider>,
    );

    rerender(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 768,
            },
          }}
        />
      </Provider>,
    );
  });

  it('renders correctly with width 310', () => {
    render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 310,
            },
          }}
        />
      </Provider>,
    );
  });

  it('renders correctly with width 500', () => {
    render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 500,
            },
          }}
        />
      </Provider>,
    );
  });

  it('renders correctly with width 1210', () => {
    render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 1210,
            },
          }}
        />
      </Provider>,
    );
  });

  it('renders correctly with width 1690', () => {
    render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: 1690,
            },
          }}
        />
      </Provider>,
    );
  });

  it('renders correctly with no width', () => {
    render(
      <Provider store={store}>
        <ObjectTypesWidget
          schemas={schemas}
          id="test"
          screen={{
            page: {
              width: undefined,
            },
          }}
        />
      </Provider>,
    );
  });
});
