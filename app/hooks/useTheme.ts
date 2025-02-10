import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { themeAtom } from '~/stores/themeStore';

export const useTheme = () => {
	const [themeConfig, setThemeConfig] = useAtom(themeAtom);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
			setThemeConfig((prev) => ({
				...prev,
				systemTheme: e.matches ? 'dark' : 'light',
			}));
		};

		// 初期状態の設定
		updateSystemTheme(mediaQuery);

		// システムのテーマ変更を監視
		mediaQuery.addEventListener('change', updateSystemTheme);
		return () => mediaQuery.removeEventListener('change', updateSystemTheme);
	}, [setThemeConfig]);

	// 現在のテーマを計算
	const currentTheme =
		themeConfig.theme === 'system'
			? themeConfig.systemTheme
			: themeConfig.theme;

	const setTheme = (theme: typeof themeConfig.theme) => {
		setThemeConfig((prev) => ({ ...prev, theme }));
	};

	return {
		theme: themeConfig.theme,
		currentTheme,
		setTheme,
	};
};
