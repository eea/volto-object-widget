import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ObjectByTypeWidget from './ObjectByTypeWidget';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  Icon: ({ name }) => <div data-testid={`icon-${name}`}>Icon</div>,
  ObjectWidget: ({ id, onChange }) => (
    <div data-testid={`objectwidget-${id}`}>
      <div>ObjectWidget</div>
      <input id={`objectwidget-${id}`} onChange={onChange} />
    </div>
  ),
}));

describe('ObjectByTypeWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const schemas = [
    { id: 'type1', schema: { title: 'Type 1' }, icon: 'icon1' },
    { id: 'type2', schema: { title: 'Type 2' }, icon: 'icon2' },
  ];

  it('renders without crashing', () => {
    const { container } = render(
      <ObjectByTypeWidget id="test" schemas={schemas} value={{}} />,
    );
    expect(container).toBeTruthy();
  });

  it('calls onChange', () => {
    const { container } = render(
      <ObjectByTypeWidget
        id="test"
        schemas={schemas}
        value={{}}
        onChange={() => {}}
      />,
    );
    expect(container).toBeTruthy();
    fireEvent.change(container.querySelector('#objectwidget-type1'), {
      target: { value: 'test' },
    });
  });

  it('renders correct number of tabs', () => {
    const { getAllByTestId } = render(
      <ObjectByTypeWidget id="test" schemas={schemas} />,
    );
    expect(getAllByTestId(/icon-/).length).toBe(2);
  });

  it('renders ObjectWidget for active tab', () => {
    const { getByTestId } = render(
      <ObjectByTypeWidget id="test" schemas={schemas} />,
    );
    expect(getByTestId('objectwidget-type1')).toBeInTheDocument();
  });

  it('switches tab on click', () => {
    const { getByTestId } = render(
      <ObjectByTypeWidget
        id="test"
        schemas={schemas}
        value={{ type1: 'test' }}
      />,
    );

    fireEvent.click(getByTestId('icon-icon2'));
    expect(getByTestId('objectwidget-type2')).toBeInTheDocument();
  });
});
