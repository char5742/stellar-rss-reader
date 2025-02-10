import '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';
import { Provider } from 'jotai';

describe('useTheme', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  it('デフォルトでsystemテーマが設定されている', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('system');
  });

  it('テーマを変更できる', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.currentTheme).toBe('dark');
  });
});