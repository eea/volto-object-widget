import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AttachedFileWidget from './AttachedFileWidget';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';

jest.mock('promise-file-reader', () => ({
  readAsDataURL: jest.fn(() =>
    Promise.resolve('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='),
  ),
}));

const mockStore = configureStore([]);
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
    subrequests: {},
  },
  router: {
    location: { pathname: '/test' },
    subrequests: {},
  },
});

describe('AttachedFileWidget', () => {
  const mockOnChange = jest.fn();
  const mockOpenObjectBrowser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedFileWidget
          id="testId"
          title="Test Title"
          onChange={mockOnChange}
          openObjectBrowser={mockOpenObjectBrowser}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('calls onChange when a file is dropped', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedFileWidget
          id="testId"
          title="Test Title"
          onChange={mockOnChange}
          openObjectBrowser={mockOpenObjectBrowser}
        />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('.file-widget-dropzone input');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });
    fireEvent.drop(dropzone);

    await waitFor(() => expect(mockOnChange).toHaveBeenCalled());
  });

  it('calls onChange when delete button is clicked', () => {
    render(
      <Provider store={store}>
        <AttachedFileWidget
          id="testId"
          title="Test Title"
          value="someValue"
          onChange={mockOnChange}
          openObjectBrowser={mockOpenObjectBrowser}
        />
      </Provider>,
    );

    const deleteButton = screen.getByLabelText('delete file');
    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith('testId', null);
  });

  it('renders without crashing', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedFileWidget
          id="testId"
          title="Test Title"
          onChange={mockOnChange}
          openObjectBrowser={mockOpenObjectBrowser}
        />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('.file-widget-dropzone input');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();
    expect(container.querySelector('.file-picker-toolbar')).toBeInTheDocument();
    expect(
      container.querySelector('.file-picker-toolbar button'),
    ).toBeInTheDocument();
    fireEvent.change(container.querySelector('.input-toolbar input'), {
      target: { value: 'test' },
    });

    fireEvent.click(
      container.querySelector(
        '.file-picker-toolbar button.ui.basic.icon.primary.button',
      ),
    );
  });
});
