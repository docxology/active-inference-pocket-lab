/**
 * @file ActivityBank.test.jsx — Activity Banking context tests
 * @description Tests pause/resume, bookmarks, and session tracking.
 * Uses real localStorage (no mocks per project conventions).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActivityBankProvider, useActivityBank } from '../../contexts/ActivityBankContext';

/** Test component that surfaces ActivityBank state */
function TestConsumer() {
  const {
    isPaused,
    bookmark,
    totalMinutes,
    sessions,
    pause,
    resume,
    setBookmark,
    clearBookmark,
    recordActivity,
  } = useActivityBank();

  return (
    <div>
      <p data-testid="is-paused">{isPaused ? 'paused' : 'active'}</p>
      <p data-testid="total-minutes">{totalMinutes}</p>
      <p data-testid="session-count">{sessions.length}</p>
      <p data-testid="bookmark">{bookmark ? JSON.stringify(bookmark) : 'none'}</p>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => setBookmark(1, 'pulse', 'step-2')}>Bookmark</button>
      <button onClick={clearBookmark}>Clear Bookmark</button>
      <button onClick={() => recordActivity(1, 'pulse', 5)}>Record</button>
    </div>
  );
}

describe('ActivityBankContext', () => {
  beforeEach(() => {
    localStorage.removeItem('spin_activity_bank');
  });

  it('starts with default state', () => {
    render(
      <ActivityBankProvider>
        <TestConsumer />
      </ActivityBankProvider>,
    );
    expect(screen.getByTestId('is-paused')).toHaveTextContent('active');
    expect(screen.getByTestId('total-minutes')).toHaveTextContent('0');
    expect(screen.getByTestId('bookmark')).toHaveTextContent('none');
  });

  it('pauses and resumes', () => {
    render(
      <ActivityBankProvider>
        <TestConsumer />
      </ActivityBankProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Pause'));
    });
    expect(screen.getByTestId('is-paused')).toHaveTextContent('paused');

    act(() => {
      fireEvent.click(screen.getByText('Resume'));
    });
    expect(screen.getByTestId('is-paused')).toHaveTextContent('active');
  });

  it('sets and clears bookmarks', () => {
    render(
      <ActivityBankProvider>
        <TestConsumer />
      </ActivityBankProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Bookmark'));
    });
    const bookmarkText = screen.getByTestId('bookmark').textContent;
    expect(bookmarkText).toContain('"moduleId":1');
    expect(bookmarkText).toContain('"stream":"pulse"');
    expect(bookmarkText).toContain('"position":"step-2"');

    act(() => {
      fireEvent.click(screen.getByText('Clear Bookmark'));
    });
    expect(screen.getByTestId('bookmark')).toHaveTextContent('none');
  });

  it('records activity and tracks total minutes', () => {
    render(
      <ActivityBankProvider>
        <TestConsumer />
      </ActivityBankProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Record'));
    });
    expect(screen.getByTestId('total-minutes')).toHaveTextContent('5');
    expect(screen.getByTestId('session-count')).toHaveTextContent('1');

    act(() => {
      fireEvent.click(screen.getByText('Record'));
    });
    expect(screen.getByTestId('total-minutes')).toHaveTextContent('10');
    expect(screen.getByTestId('session-count')).toHaveTextContent('2');
  });

  it('persists state to localStorage', () => {
    render(
      <ActivityBankProvider>
        <TestConsumer />
      </ActivityBankProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Record'));
    });

    const stored = JSON.parse(localStorage.getItem('spin_activity_bank'));
    expect(stored).toBeTruthy();
    expect(stored.totalMinutes).toBe(5);
    expect(stored.sessions).toHaveLength(1);
  });
});
