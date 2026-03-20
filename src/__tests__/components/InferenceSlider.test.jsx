/**
 * @file InferenceSlider.test.jsx — Slider component tests
 * @description Tests the touch-optimized inference slider.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InferenceSlider from '../../components/interactive/InferenceSlider';

describe('InferenceSlider', () => {
  it('renders with default value', () => {
    render(<InferenceSlider label="Test Slider" />);
    expect(screen.getByLabelText('Test Slider')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders with custom value and unit', () => {
    render(<InferenceSlider label="Prior" value={75} unit="%" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<InferenceSlider label="Slider" onChange={handleChange} />);
    const input = screen.getByLabelText('Slider');
    fireEvent.change(input, { target: { value: '30' } });
    expect(handleChange).toHaveBeenCalledWith(30);
  });

  it('renders range labels when provided', () => {
    render(<InferenceSlider label="X" leftLabel="Low" rightLabel="High" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('uses custom formatValue function', () => {
    render(
      <InferenceSlider
        label="Custom"
        value={42}
        formatValue={(v) => `Level ${v}`}
      />,
    );
    expect(screen.getByText('Level 42')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<InferenceSlider label="Aria Test" min={0} max={200} value={100} />);
    const input = screen.getByLabelText('Aria Test');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '200');
    expect(input).toHaveAttribute('aria-valuenow', '100');
  });
});
