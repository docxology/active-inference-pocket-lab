/**
 * @file Module1Pulse.test.jsx — Module 1 Pulse stream tests
 * @description Tests the Pulse stream micro-inference experience.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../contexts/AppContext';
import { ActivityBankProvider } from '../../contexts/ActivityBankContext';
import PulseStream from '../../modules/module1/PulseStream';

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AppProvider>
        <ActivityBankProvider>
          {ui}
        </ActivityBankProvider>
      </AppProvider>
    </BrowserRouter>,
  );
}

describe('Module 1 — PulseStream', () => {
  it('renders the opening question', () => {
    renderWithProviders(<PulseStream />);
    expect(screen.getByText(/What if your brain is a prediction machine/)).toBeInTheDocument();
  });

  it('renders the prior belief slider', () => {
    renderWithProviders(<PulseStream />);
    expect(screen.getByLabelText('Your Prior Belief')).toBeInTheDocument();
  });

  it('shows continue button after slider interaction', () => {
    renderWithProviders(<PulseStream />);
    const slider = screen.getByLabelText('Your Prior Belief');
    
    act(() => {
      fireEvent.change(slider, { target: { value: '30' } });
    });

    expect(screen.getByText(/Continue/)).toBeInTheDocument();
  });

  it('has step progress dots', () => {
    renderWithProviders(<PulseStream />);
    const dots = document.querySelectorAll('.pulse-stream__dot');
    expect(dots.length).toBe(3); // 3 steps
  });

  it('has proper ARIA tabpanel role', () => {
    renderWithProviders(<PulseStream />);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });
});
