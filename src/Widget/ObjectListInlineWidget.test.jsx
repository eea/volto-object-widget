import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import ObjectListInlineWidget from './ObjectListInlineWidget';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  FormFieldWrapper: ({ children }) => <div>{children}</div>,
  DragDropList: ({ childList, onMoveItem, children }) => {
    // Create mock drag info without jest functions to avoid DOM warnings
    const draginfo = {
      innerRef: () => {},
      draggableProps: {},
      dragHandleProps: {},
    };
    return (
      <div>
        <div>DragDropList</div>
        {childList.map((child, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            className="dragdrop-list-item-mock"
            onKeyDown={() => {}}
            onClick={() => {
              onMoveItem({
                source: { index: 0 },
                destination: { index: 1 },
              });
            }}
          >
            {children({ child: child[1], childId: child[0], index, draginfo })}
          </div>
        ))}
      </div>
    );
  },
  ObjectWidget: ({ onChange }) => (
    <div className="objectwidget-mock">
      <div>ObjectWidget</div>
      <input onChange={onChange} />
    </div>
  ),
  Icon: () => <div>VoltoIcon</div>,
}));

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
}));

const mockStore = configureStore([]);
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
});

describe('ObjectListInlineWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <ObjectListInlineWidget
          schema={{ title: 'Test' }}
          id="test"
          title="Tessst"
          onChange={() => {}}
        />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });

  it('renders Add button and adds an item on click', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <ObjectListInlineWidget
          id="test"
          schema={{ title: 'Test' }}
          onChange={onChange}
        />
      </Provider>,
    );
    fireEvent.click(getByText(`Add Test`));
    expect(onChange).toHaveBeenCalledWith(
      'test',
      expect.arrayContaining([
        expect.objectContaining({
          '@id': expect.stringContaining('mock-uuid'),
        }),
      ]),
    );
  });

  it('moves an item by calling onMoveItem', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <ObjectListInlineWidget
          id="test"
          schema={{ title: 'Test' }}
          value={[{ '@id': '1' }, { '@id': '2' }]}
          onChange={onChange}
        />
      </Provider>,
    );

    fireEvent.click(container.querySelector('.dragdrop-list-item-mock'));
    expect(onChange).toHaveBeenCalledWith('test', [
      { '@id': '2' },
      { '@id': '1' },
    ]);
  });

  it('renders DragDropList', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ObjectListInlineWidget
          id="test"
          schema={{ title: 'Test' }}
          value={[{ '@id': '1' }, { '@id': '2' }]}
          title="Tessst"
        />
      </Provider>,
    );
    expect(getByText('DragDropList')).toBeInTheDocument();
  });

  it('renders ObjectWidget', () => {
    const onChange = jest.fn();
    const { container, getByText } = render(
      <Provider store={store}>
        <ObjectListInlineWidget
          id="test"
          schema={{ title: 'Test' }}
          schemaExtender={() => ({ title: 'ObjectWidget' })}
          value={[{ '@id': '1' }]}
          title="Tessst"
          onChange={onChange}
        />
      </Provider>,
    );
    expect(getByText('ObjectWidget')).toBeInTheDocument();
    expect(container.querySelector('.objectwidget-mock')).toBeInTheDocument();
    fireEvent.change(container.querySelector('.objectwidget-mock input'), {
      target: { value: 'test' },
    });
  });
});
