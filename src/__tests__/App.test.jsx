/**
 * @file App.test.jsx — Root application tests
 * @description Tests core routing and context provider setup.
 * Uses real methods (no mocks per project conventions).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the home page by default', () => {
    render(<App />);
    expect(screen.getByText('Spin')).toBeInTheDocument();
    expect(screen.getByText('The Active Inference Pocket Lab')).toBeInTheDocument();
  });

  it('renders the bottom navigation', () => {
    render(<App />);
    const nav = screen.getByLabelText('Main navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Modules')).toBeInTheDocument();
    expect(screen.getByLabelText('Hearth')).toBeInTheDocument();
    expect(screen.getByLabelText('Map')).toBeInTheDocument();
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('renders the quick start button', () => {
    render(<App />);
    expect(screen.getByText(/Begin The First Orbit/)).toBeInTheDocument();
  });
});
