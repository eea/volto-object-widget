import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AttachedImageWidget } from './AttachedImageWidget';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';

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
    formatMessage: jest.fn(),
  },
  content: {
    subrequests: {},
  },
  router: {
    location: { pathname: '/test' },
  },
});

jest.mock('promise-file-reader', () => ({
  readAsDataURL: jest.fn(() =>
    Promise.resolve('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='),
  ),
}));

describe('AttachedImageWidget', () => {
  const mockCreateContent = jest.fn();
  const mockOpenObjectBrowser = jest.fn();
  const mockOnChange = jest.fn();

  const props = {
    id: 'imageId',
    title: 'Image',
    value: 'image.png',
    block: 'blockId',
    request: {
      loading: false,
      loaded: true,
    },
    pathname: '/path/to/page',
    onChange: mockOnChange,
    openObjectBrowser: mockOpenObjectBrowser,
    createContent: mockCreateContent,
    intl: {
      locale: 'en',
      messages: {},
      formatMessage: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with image preview and call onChange when cancel button is clicked', () => {
    const { getByAltText, getByRole } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} />
      </Provider>,
    );

    const imagePreview = getByAltText('Preview');
    expect(imagePreview).toBeInTheDocument();

    const cancelButton = getByRole('button');
    fireEvent.click(cancelButton);

    expect(mockOnChange).toHaveBeenCalledWith('imageId', '');
  });

  it('should render the component and handle URL input and cancel button', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} value={null} />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    fireEvent.change(
      container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
      { target: { value: 'test' } },
    );
    fireEvent.click(
      container.querySelector(
        '.toolbar-inner .ui.buttons button.ui.basic.icon.primary.button',
      ),
    );

    fireEvent.change(
      container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
      { target: { value: 'test' } },
    );
    fireEvent.click(
      container.querySelector(
        '.toolbar-inner .ui.buttons button.ui.basic.icon.secondary.button.cancel',
      ),
    );
  });

  it('should render the component handle object browser button click', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} value={null} />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    fireEvent.click(
      container.querySelector('.toolbar-inner .ui.buttons button'),
    );
  });

  it('should handle file input and rerender based on request loading and loaded states', async () => {
    const { rerender, container } = render(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          request={{
            loading: true,
            loaded: true,
          }}
          value={null}
        />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    Object.defineProperty(
      container.querySelector('label[role="button"] input[type="file"]'),
      'files',
      {
        value: [file],
      },
    );
    fireEvent.change(
      container.querySelector('label[role="button"] input[type="file"]'),
      { target: { value: '' } },
    );

    rerender(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          request={{
            loading: false,
            loaded: true,
          }}
          value={null}
          content={{
            '@id': 'imageId',
          }}
        />
      </Provider>,
    );

    rerender(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          request={{
            loading: false,
            loaded: false,
          }}
          value={null}
          content={{
            '@id': 'imageId',
          }}
        />
      </Provider>,
    );
  });

  it('should handle file input via label button ', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} value={null} />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    Object.defineProperty(
      container.querySelector('label[role="button"] input[type="file"]'),
      'files',
      {
        value: [file],
      },
    );
    fireEvent.change(
      container.querySelector('label[role="button"] input[type="file"]'),
      { target: { value: '' } },
    );
  });

  it('should handle drag and drop events ', async () => {
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} value={null} />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });
    fireEvent.dragEnter(dropzone);
    fireEvent.dragLeave(dropzone);
    fireEvent.drop(dropzone);
  });
  it('should render the component based on selectedItemAttr prop when choosing an image from objectBrowser', async () => {
    const selectedItemAttrs = ['image_field', 'image_scales', '@type'];
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          selectedItemAttrs={selectedItemAttrs}
          value={null}
        />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });
    expect(dropzone).toBeInTheDocument();

    fireEvent.change(
      container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
      { target: { value: 'test' } },
    );
    fireEvent.click(
      container.querySelector(
        '.toolbar-inner .ui.buttons button.ui.basic.icon.primary.button',
      ),
    );

    fireEvent.change(
      container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
      { target: { value: 'test' } },
    );
    fireEvent.click(
      container.querySelector(
        '.toolbar-inner .ui.buttons button.ui.basic.icon.secondary.button.cancel',
      ),
    );
  });
});
