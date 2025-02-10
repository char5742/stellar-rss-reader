import '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useTheme } from './useTheme';

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
