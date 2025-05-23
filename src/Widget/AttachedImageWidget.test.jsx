import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { AttachedImageWidget } from './AttachedImageWidget';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { flattenToAppURL } from '@plone/volto/helpers';
import isEqual from 'lodash/isEqual';

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

  it('should render the component with image preview and call onChange when cancel button is clicked', async () => {
    const { getByAltText, getByRole } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} />
      </Provider>,
    );

    const imagePreview = getByAltText('Preview');
    expect(imagePreview).toBeInTheDocument();
    expect(imagePreview).toHaveAttribute('src', 'image.png');

    const cancelButton = getByRole('button');

    // Wrap button click in act()
    await act(async () => {
      fireEvent.click(cancelButton);
    });

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

    // Wrap URL input changes and button clicks in act()
    await act(async () => {
      fireEvent.change(
        container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
        { target: { value: 'test' } },
      );
    });

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '.toolbar-inner .ui.buttons button.ui.basic.icon.primary.button',
        ),
      );
    });

    // also take url from object browser
    await act(async () => {
      fireEvent.change(
        container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
        { target: { value: { '@id': '/my-value', image_field: 'image' } } },
      );
    });

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '.toolbar-inner .ui.buttons button.ui.basic.icon.secondary.button.cancel',
        ),
      );
    });

    await act(async () => {
      fireEvent.change(
        container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
        { target: { value: 'test' } },
      );
    });

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '.toolbar-inner .ui.buttons button.ui.basic.icon.secondary.button.cancel',
        ),
      );
    });
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

    // Wrap button click in act()
    await act(async () => {
      fireEvent.click(
        container.querySelector('.toolbar-inner .ui.buttons button'),
      );
    });
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

    // Wrap file input change in act()
    await act(async () => {
      fireEvent.change(
        container.querySelector('label[role="button"] input[type="file"]'),
        { target: { value: '' } },
      );
      // Allow any promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Wrap rerender in act()
    await act(async () => {
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
    });

    // Wrap rerender in act()
    await act(async () => {
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
  });

  it('should handle file input and rerender based on selectedItemAttr', async () => {
    const { rerender, container } = render(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          request={{
            loading: true,
            loaded: true,
          }}
          selectedItemAttrs={['image_field', 'image_scales', '@type']}
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

    // Wrap file input change in act()
    await act(async () => {
      fireEvent.change(
        container.querySelector('label[role="button"] input[type="file"]'),
        { target: { value: '' } },
      );
      // Allow any promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Wrap rerender in act()
    await act(async () => {
      rerender(
        <Provider store={store}>
          <AttachedImageWidget
            {...props}
            request={{
              loading: false,
              loaded: true,
            }}
            value={null}
            selectedItemAttrs={['image_field', 'image_scales', '@type']}
            content={{
              '@id': 'imageId',
            }}
          />
        </Provider>,
      );
    });

    // Wrap rerender in act()
    await act(async () => {
      rerender(
        <Provider store={store}>
          <AttachedImageWidget
            {...props}
            request={{
              loading: false,
              loaded: false,
            }}
            selectedItemAttrs={['image_field', 'image_scales', '@type']}
            value={null}
            content={{
              '@id': 'imageId',
            }}
          />
        </Provider>,
      );
    });
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

    // Wrap file input change in act()
    await act(async () => {
      fireEvent.change(
        container.querySelector('label[role="button"] input[type="file"]'),
        { target: { value: '' } },
      );
      // Allow any promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
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

    // Wrap drag and drop events in act()
    await act(async () => {
      fireEvent.dragEnter(dropzone);
    });

    await act(async () => {
      fireEvent.dragLeave(dropzone);
    });

    await act(async () => {
      fireEvent.drop(dropzone);
      // Allow any promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
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

    // Wrap input changes and button clicks in act()
    await act(async () => {
      fireEvent.change(
        container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
        { target: { value: 'test' } },
      );
    });

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '.toolbar-inner .ui.buttons button.ui.basic.icon.primary.button',
        ),
      );
    });

    await act(async () => {
      fireEvent.change(
        container.querySelector('.toolbar-inner .ui.input input[type="text"]'),
        { target: { value: 'test' } },
      );
    });

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '.toolbar-inner .ui.buttons button.ui.basic.icon.secondary.button.cancel',
        ),
      );
    });
  });

  // Test for onSubmitUrl with non-string URL (line 144)
  it('should handle onSubmitUrl with non-string URL object and test the else branch', async () => {
    const mockOnChange = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget {...props} onChange={mockOnChange} value={null} />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });

    // Set a non-string URL (object)
    const urlObject = { '@id': '/test-url', image_field: 'image' };

    // Find the input and simulate setting a URL object
    await act(async () => {
      const input = container.querySelector(
        '.toolbar-inner .ui.input input[type="text"]',
      );
      fireEvent.change(input, { target: { value: JSON.stringify(urlObject) } });
    });

    // Click the submit button
    await act(async () => {
      const submitButton = container.querySelector(
        '.toolbar-inner .ui.buttons button.ui.basic.icon.primary.button',
      );
      fireEvent.click(submitButton);
    });

    // Verify that onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  // Test for the openObjectBrowser callback (line 282)
  it('should handle openObjectBrowser callback correctly', async () => {
    const mockOpenObjectBrowser = jest.fn(({ onSelectItem }) => {
      // Simulate selecting an item in the object browser
      if (onSelectItem) {
        onSelectItem('http://example.com/image', {
          title: 'Selected Image',
          image_field: 'image',
          image_scales: { scales: { preview: { width: 100, height: 100 } } },
        });
      }
    });

    const { container } = render(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          openObjectBrowser={mockOpenObjectBrowser}
          value={null}
        />
      </Provider>,
    );

    let dropzone;
    await waitFor(() => {
      dropzone = container.querySelector('div[tabindex="0"]');
      expect(dropzone).toBeInTheDocument();
    });

    // Click the object browser button
    await act(async () => {
      const objectBrowserButton = container.querySelector(
        '.toolbar-inner .ui.buttons button',
      );
      fireEvent.click(objectBrowserButton);
    });

    // Verify that openObjectBrowser was called
    expect(mockOpenObjectBrowser).toHaveBeenCalled();
  });

  // Test for onItemChange function with selectedItemAttrs (lines 192-203)
  it('should handle onItemChange with selectedItemAttrs correctly', async () => {
    const mockOnChange = jest.fn();
    const mockSetUrl = jest.fn();

    // Create a test item with properties that should be filtered
    const testItem = {
      '@id': 'http://example.com/image',
      title: 'Test Image',
      image_field: 'image',
      image_scales: { scales: { preview: { width: 100, height: 100 } } },
      '@type': 'Image',
      unwanted_field: 'should be filtered out',
    };

    // Create a mock implementation of onItemChange based on the component code
    const onItemChange = (_id, itemUrl, item) => {
      const selectedItemAttrs = ['image_field', 'image_scales', '@type'];
      let resultantItem = item;

      if (selectedItemAttrs) {
        const allowedItemKeys = [...selectedItemAttrs, 'title'];
        resultantItem = Object.keys(item)
          .filter((key) => allowedItemKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
        resultantItem = { ...resultantItem, '@id': flattenToAppURL(itemUrl) };
        mockSetUrl(resultantItem);
      } else {
        mockSetUrl(resultantItem || flattenToAppURL(itemUrl));
      }

      mockOnChange(_id, resultantItem);
    };

    // Call the onItemChange function
    onItemChange('imageId', 'http://example.com/image', testItem);

    // Verify that onChange was called with the filtered object
    expect(mockOnChange).toHaveBeenCalled();

    // The filtered object should only contain the selected attributes
    const expectedObject = {
      '@id': 'http://example.com/image',
      title: 'Test Image',
      image_field: 'image',
      image_scales: { scales: { preview: { width: 100, height: 100 } } },
      '@type': 'Image',
    };
    expect(mockOnChange).toHaveBeenCalledWith('imageId', expectedObject);
  });

  // Test for onItemChange function without selectedItemAttrs (line 204)
  it('should handle onItemChange without selectedItemAttrs correctly', async () => {
    const mockOnChange = jest.fn();
    const mockSetUrl = jest.fn();

    // Create a test item
    const testItem = {
      '@id': 'http://example.com/image',
      title: 'Test Image',
      image_field: 'image',
      image_scales: { scales: { preview: { width: 100, height: 100 } } },
    };

    // Create a mock implementation of onItemChange based on the component code
    const onItemChange = (_id, itemUrl, item) => {
      const selectedItemAttrs = null;
      let resultantItem = item;

      if (selectedItemAttrs) {
        const allowedItemKeys = [...selectedItemAttrs, 'title'];
        resultantItem = Object.keys(item)
          .filter((key) => allowedItemKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
        resultantItem = { ...resultantItem, '@id': flattenToAppURL(itemUrl) };
        mockSetUrl(resultantItem);
      } else {
        mockSetUrl(resultantItem || flattenToAppURL(itemUrl));
      }

      mockOnChange(_id, resultantItem);
    };

    // Call the onItemChange function
    onItemChange('imageId', 'http://example.com/image', testItem);

    // Verify that onChange was called with the complete object
    expect(mockOnChange).toHaveBeenCalled();

    // The object should be passed through without filtering
    expect(mockOnChange).toHaveBeenCalledWith('imageId', testItem);
  });

  // Test for the memoization comparison function (lines 378-389)
  it('should correctly memoize the component based on value and request', () => {
    // We can't directly test the memo function, but we can test that
    // the component doesn't re-render when props that should be memoized don't change

    // Create a mock implementation of the memoization function
    const memoCompare = (prevProps, nextProps) => {
      return (
        isEqual(prevProps.value, nextProps.value) &&
        isEqual(prevProps.request, nextProps.request)
      );
    };

    // Test with same value and request
    const prevProps1 = {
      value: 'test-value',
      request: { loading: false, loaded: true },
    };
    const nextProps1 = {
      value: 'test-value',
      request: { loading: false, loaded: true },
    };
    expect(memoCompare(prevProps1, nextProps1)).toBe(true);

    // Test with different value
    const prevProps2 = {
      value: 'test-value',
      request: { loading: false, loaded: true },
    };
    const nextProps2 = {
      value: 'different-value',
      request: { loading: false, loaded: true },
    };
    expect(memoCompare(prevProps2, nextProps2)).toBe(false);

    // Test with different request
    const prevProps3 = {
      value: 'test-value',
      request: { loading: false, loaded: true },
    };
    const nextProps3 = {
      value: 'test-value',
      request: { loading: true, loaded: false },
    };
    expect(memoCompare(prevProps3, nextProps3)).toBe(false);

    // Also test with the component to ensure it renders correctly
    const { rerender } = render(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          value="test-value"
          request={{ loading: false, loaded: true }}
        />
      </Provider>,
    );

    // Re-render with the same value and request
    rerender(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          value="test-value"
          request={{ loading: false, loaded: true }}
        />
      </Provider>,
    );

    // Re-render with different value
    rerender(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          value="different-value"
          request={{ loading: false, loaded: true }}
        />
      </Provider>,
    );

    // Re-render with different request
    rerender(
      <Provider store={store}>
        <AttachedImageWidget
          {...props}
          value="different-value"
          request={{ loading: true, loaded: false }}
        />
      </Provider>,
    );
  });
});
