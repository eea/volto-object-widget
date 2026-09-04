import { vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MappingWidget from './MappingWidget';
import '@testing-library/jest-dom';

vi.mock('@plone/volto/components/manage/Form/Field', () => {
  return {
    default: function MockField({ id, value, onChange }) {
      return (
        <input
          data-testid={`field-${id}`}
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    },
  };
});

describe('MappingWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const options = [
    { id: 'option1', title: 'Option 1' },
    { id: 'option2', title: 'Option 2' },
  ];

  it('renders without crashing', () => {
    const { container } = render(
      <MappingWidget id="test" title="Test Title" options={options} />,
    );
    expect(container).toBeTruthy();
  });

  it('renders correct number of fields', () => {
    const { getAllByTestId } = render(
      <MappingWidget id="test" title="Test Title" options={options} />,
    );
    expect(getAllByTestId(/field-/).length).toBe(2);
  });

  it('updates value on field change', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <MappingWidget
        id="test"
        title="Test Title"
        options={options}
        onChange={onChange}
      />,
    );

    fireEvent.change(getByTestId('field-test-option1'), {
      target: { value: 'new value' },
    });

    expect(onChange).toHaveBeenCalledWith('test', { option1: 'new value' });
  });
});
