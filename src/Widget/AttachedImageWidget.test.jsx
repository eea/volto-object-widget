import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
});
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
});
