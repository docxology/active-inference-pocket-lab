/**
 * @file AppContext.test.jsx — Tests for AppContext with persistence
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp, STREAMS } from '../../contexts/AppContext';

function wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.removeItem('spin_module_progress');
  });

  it('starts with default stream state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.activeStream).toBe(STREAMS.PULSE);
    expect(result.current.currentModuleId).toBeNull();
  });

  it('switches streams', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setStream(STREAMS.VISION));
    expect(result.current.activeStream).toBe(STREAMS.VISION);
  });

  it('sets current module', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setModule(1));
    expect(result.current.currentModuleId).toBe(1);
  });

  it('updates module progress', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.updateProgress(1, 'pulse', 50));
    expect(result.current.moduleProgress[1].pulse).toBe(50);
  });

  it('clamps progress to 0-100', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.updateProgress(1, 'pulse', 150));
    expect(result.current.moduleProgress[1].pulse).toBe(100);
    act(() => result.current.updateProgress(1, 'vision', -10));
    expect(result.current.moduleProgress[1].vision).toBe(0);
  });

  it('persists progress to localStorage', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.updateProgress(1, 'pulse', 75));
    const stored = JSON.parse(localStorage.getItem('spin_module_progress'));
    expect(stored['1'].pulse).toBe(75);
  });

  it('computes module progress average', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.updateProgress(1, 'pulse', 100);
      result.current.updateProgress(1, 'vision', 50);
      result.current.updateProgress(1, 'core', 0);
    });
    expect(result.current.getModuleProgress(1)).toBe(50);
  });

  it('computes overall progress', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.updateProgress(1, 'pulse', 100);
      result.current.updateProgress(1, 'vision', 100);
      result.current.updateProgress(1, 'core', 100);
    });
    // 100% of module 1 = 100/10 = 10% overall (across 10 modules)
    expect(result.current.getOverallProgress()).toBe(10);
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useApp());
    }).toThrow('[useApp] Must be used within an AppProvider');
  });
});
