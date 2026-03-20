/**
 * @file StreamSwitcher.test.jsx — Stream switcher tests
 * @description Tests the Triple-Stream selector component.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../contexts/AppContext';
import StreamSwitcher from '../../components/layout/StreamSwitcher';

/** Helper to render with required providers */
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AppProvider>{ui}</AppProvider>
    </BrowserRouter>,
  );
}

describe('StreamSwitcher', () => {
  it('renders all three stream tabs', () => {
    renderWithProviders(<StreamSwitcher />);
    expect(screen.getByText('Pulse')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(screen.getByText('Core')).toBeInTheDocument();
  });

  it('shows Pulse as active by default', () => {
    renderWithProviders(<StreamSwitcher />);
    const pulseTab = screen.getByRole('tab', { name: /pulse/i });
    expect(pulseTab).toHaveAttribute('aria-selected', 'true');
  });

  it('switches streams on click', () => {
    renderWithProviders(<StreamSwitcher />);
    const visionTab = screen.getByText('Vision').closest('[role="tab"]');
    fireEvent.click(visionTab);
    expect(visionTab).toHaveAttribute('aria-selected', 'true');
  });

  it('has proper ARIA role structure', () => {
    renderWithProviders(<StreamSwitcher />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });
});
