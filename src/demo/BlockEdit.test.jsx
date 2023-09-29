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
    <input id="inlineform" type="text" onChange={props.onChangeField} />
  </div>
));

describe('BlockEdit', () => {
  it('renders without crashing', () => {
    const { container } = render(<BlockEdit />);
    expect(container).toBeTruthy();
  });

  it('renders SidebarPortal when selected is false', () => {
    const { queryByText } = render(<BlockEdit selected={false} />);
    expect(queryByText('InlineForm')).toBeInTheDocument();
  });

  it('renders SidebarPortal when selected is true', () => {
    const { getByText } = render(<BlockEdit selected={true} />);
    expect(getByText('InlineForm')).toBeInTheDocument();
  });

  it('calls onSelectBlock when clicked', () => {
    const onSelectBlock = jest.fn();
    const { getByRole } = render(<BlockEdit onSelectBlock={onSelectBlock} />);
    fireEvent.click(getByRole('presentation'));
    expect(onSelectBlock).toHaveBeenCalled();
  });

  it('calls onChangeBlock when onChangeField is called', () => {
    const onChangeBlock = jest.fn();
    const { container } = render(<BlockEdit onChangeBlock={onChangeBlock} />);
    fireEvent.change(container.querySelector('#inlineform'), {
      target: { value: 'foo' },
    });
    expect(onChangeBlock).toHaveBeenCalled();
  });
});
