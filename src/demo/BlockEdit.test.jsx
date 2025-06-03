import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BlockEdit from './BlockEdit';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  SidebarPortal: ({ children }) => <div>{children}</div>,
}));
jest.mock('@plone/volto/components/manage/Form/InlineForm', () => (props) => (
  <div>
    <div>InlineForm</div>
    <input
      id="inlineform"
      type="text"
      onChange={(e) => props.onChangeField('foo', e.target.value)}
    />
  </div>
));

describe('BlockEdit', () => {
  const defaultProps = {
    data: {},
    block: 'test-block-id',
    onSelectBlock: jest.fn(),
    onChangeBlock: jest.fn(),
    selected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<BlockEdit {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('renders SidebarPortal when selected is false', () => {
    const { queryByText } = render(
      <BlockEdit {...defaultProps} selected={false} />,
    );
    expect(queryByText('InlineForm')).toBeInTheDocument();
  });

  it('renders SidebarPortal when selected is true', () => {
    const { getByText } = render(
      <BlockEdit {...defaultProps} selected={true} />,
    );
    expect(getByText('InlineForm')).toBeInTheDocument();
  });

  it('calls onSelectBlock when clicked', () => {
    const onSelectBlock = jest.fn();
    const { getByRole } = render(
      <BlockEdit {...defaultProps} onSelectBlock={onSelectBlock} />,
    );
    fireEvent.click(getByRole('presentation'));
    expect(onSelectBlock).toHaveBeenCalledWith('test-block-id');
  });

  it('calls onChangeBlock when onChangeField is called', () => {
    const onChangeBlock = jest.fn();
    const { container } = render(
      <BlockEdit {...defaultProps} onChangeBlock={onChangeBlock} />,
    );
    fireEvent.change(container.querySelector('#inlineform'), {
      target: { value: 'foo' },
    });
    expect(onChangeBlock).toHaveBeenCalledWith('test-block-id', { foo: 'foo' });
  });

  it('renders with image data', () => {
    const dataWithImage = {
      image: {
        '@id': 'http://localhost:3000/image.jpg',
        download: 'http://localhost:3000/image.jpg',
      },
      imageSize: 'large',
      verticalAlign: 'middle',
    };
    const { container } = render(
      <BlockEdit {...defaultProps} data={dataWithImage} />,
    );
    expect(container).toBeTruthy();
    expect(container.querySelector('img')).toBeInTheDocument();
  });
});
