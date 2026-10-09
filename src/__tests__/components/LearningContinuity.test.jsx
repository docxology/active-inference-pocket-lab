import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from '../../contexts/SettingsContext';
import { AppProvider } from '../../contexts/AppContext';
import { ActivityBankProvider } from '../../contexts/ActivityBankContext';
import StreamTemplate from '../../components/layout/StreamTemplate';
import { useStreamProgress } from '../../modules/shared/useStreamProgress';
import MathBlock from '../../components/interactive/MathBlock';
import PauseButton from '../../components/interactive/PauseButton';

function wrapper({ children }) {
  return (
    <MemoryRouter initialEntries={['/modules/2']}>
      <SettingsProvider>
        <AppProvider>
          <ActivityBankProvider>
            <Routes>
              <Route path="/modules/:moduleId" element={children} />
            </Routes>
          </ActivityBankProvider>
        </AppProvider>
      </SettingsProvider>
    </MemoryRouter>
  );
}
function LearningStream() {
  const callbacks = useStreamProgress(2, 'pulse');
  return (
    <StreamTemplate
      streamKey="pulse"
      beats={[
        { id: 'first', content: <h2>First step</h2> },
        { id: 'second', content: <h2>Second step</h2> },
        { id: 'last', content: <h2>Final step</h2> },
      ]}
      {...callbacks}
    />
  );
}

describe('learning controls', () => {
  it('banks the live step on explicit pause even when automatic bookmarking is disabled', async () => {
    localStorage.setItem('spin_settings', JSON.stringify({ autoBookmark: false }));
    const view = render(
      <>
        <LearningStream />
        <PauseButton moduleId={2} />
      </>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Beat 2' }));
    await screen.findByRole('heading', { name: 'Second step' });
    expect(JSON.parse(localStorage.getItem('spin_stream_positions'))[2]).toBeUndefined();
    expect(JSON.parse(localStorage.getItem('spin_activity_bank')).bookmark).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Pause and rest' }));
    expect(JSON.parse(localStorage.getItem('spin_activity_bank')).bookmark.position).toBe(1);
    expect(JSON.parse(localStorage.getItem('spin_stream_positions'))[2].pulse).toBe(1);
    view.unmount();
    render(<LearningStream />, { wrapper });
    await screen.findByRole('heading', { name: 'Second step' });
  });
  it('does not mark completion merely on entering the final step and records only once', async () => {
    render(<LearningStream />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Continue →' }));
    await screen.findByRole('heading', { name: 'Second step' });
    fireEvent.click(screen.getByRole('button', { name: 'Continue →' }));
    await screen.findByRole('heading', { name: 'Final step' });
    expect(JSON.parse(localStorage.getItem('spin_module_progress'))[2].pulse).toBe(67);
    fireEvent.click(screen.getByRole('button', { name: 'Spin 🌀' }));
    fireEvent.click(screen.getByRole('button', { name: 'Spin 🌀' }));
    expect(JSON.parse(localStorage.getItem('spin_module_progress'))[2].pulse).toBe(100);
    expect(JSON.parse(localStorage.getItem('spin_activity_bank')).sessions).toHaveLength(1);
  });
  it('loads saved steps and bookmarks when a stream mounts', async () => {
    const view = render(<LearningStream />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Beat 2' }));
    await screen.findByRole('heading', { name: 'Second step' });
    expect(screen.getByRole('button', { name: 'Beat 2' })).toHaveAttribute('aria-current', 'step');
    expect(JSON.parse(localStorage.getItem('spin_activity_bank')).bookmark.position).toBe(1);
    view.unmount();
    render(<LearningStream />, { wrapper });
    await screen.findByRole('heading', { name: 'Second step' });
  });
  it('uses the math preference and blocks trusted HTML commands', async () => {
    localStorage.setItem('spin_settings', JSON.stringify({ showMathByDefault: true }));
    render(
      <MathBlock
        latex={'\\htmlClass{unexpected}{x}'}
        steps={[{ latex: 'x = 1', note: 'A real step' }]}
      />,
      { wrapper },
    );
    expect(screen.getByText('A real step')).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('.unexpected')).toBeNull());
  });
});
