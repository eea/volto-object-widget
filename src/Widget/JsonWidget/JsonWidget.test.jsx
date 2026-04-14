import React from 'react';
import { Provider } from 'react-intl-redux';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import JsonWidget from './JsonWidget';
jest.mock('jsoneditor/dist/jsoneditor.min.css', () => {});
jest.mock('./json-widget.css', () => {});

// Mock semantic-ui-react components to simple HTML elements
jest.mock('semantic-ui-react', () => {
  const Button = (props) => <button {...props}>{props.children}</button>;
  const Segment = (props) => <div {...props}>{props.children}</div>;
  const TextArea = (props) => <textarea {...props} />; // readOnly will be passed
  const Modal = ({ open, children }) =>
    open ? <div data-testid="modal">{children}</div> : null;
  Modal.Content = ({ children }) => <div>{children}</div>;
  Modal.Actions = ({ children }) => <div>{children}</div>;
  return { Button, Segment, TextArea, Modal };
});

// Mock FormFieldWrapper from @plone/volto/components
jest.mock('@plone/volto/components/manage/Widgets/FormFieldWrapper', () => {
  return ({ children, title, description, className }) => (
    <div className={className} data-testid="form-field-wrapper">
      {title && <label>{title}</label>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
});

// Mock JsonWidget helper functions to avoid loading jsoneditor
jest.mock('./helpers', () => ({
  initEditor: jest.fn(({ onInit, editor }) => {
    // Provide a fake editor with get and destroy methods
    editor.current = {
      get: () => ({ mocked: 'value' }),
      validate: () => Promise.resolve([]),
      destroy: jest.fn(),
    };
    if (onInit) onInit();
  }),
  destroyEditor: jest.fn(),
  validateEditor: jest.fn(() => Promise.resolve({ valid: true, errors: [] })),
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

describe('JsonWidget', () => {
  const defaultProps = {
    id: 'test-json',
    title: 'JSON Widget',
    description: 'Edit JSON data',
    value: { a: 1, b: 2 },
    onChange: jest.fn(),
    required: false,
    error: [],
  };

  test('renders preview of JSON value', () => {
    render(
      <Provider store={store}>
        <JsonWidget {...defaultProps} />
      </Provider>,
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    // preview should be pretty‑printed JSON
    expect(textarea).toHaveValue(JSON.stringify(defaultProps.value, null, 2));
  });

  test('opens modal and applies changes', async () => {
    render(
      <Provider store={store}>
        <JsonWidget {...defaultProps} />
      </Provider>,
    );
    // click the textarea to open editor
    fireEvent.click(screen.getByRole('textbox'));
    // modal should appear
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    // Wait for Apply button to become enabled after initEditor mock triggers onInit
    await waitFor(() => expect(screen.getByText('Apply')).not.toBeDisabled());
    const applyBtn = screen.getByText('Apply');
    // Click Apply; onChange should be called with mocked editor value
    fireEvent.click(applyBtn);
    await waitFor(() =>
      expect(defaultProps.onChange).toHaveBeenCalledWith('test-json', {
        mocked: 'value',
      }),
    );
  });
});
