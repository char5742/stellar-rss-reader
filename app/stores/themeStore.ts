import { atomWithStorage } from 'jotai/utils';
import type { ThemeConfig } from '../types/theme';

// アプリケーションのテーマ設定を管理するatom（localStorage対応）
export const themeAtom = atomWithStorage<ThemeConfig>('theme-storage', {
	theme: 'system',
	systemTheme: 'light',
});
