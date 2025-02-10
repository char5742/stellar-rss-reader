import '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import {
	RouterProvider,
	createMemoryHistory,
	createRouter,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import { routeTree } from '../routeTree.gen';
import { RootLayout } from './RootLayout';

describe('RootLayout', () => {
	const createTestRouter = () => {
		const memoryHistory = createMemoryHistory({
			initialEntries: ['/'],
		});

		return createRouter({
			routeTree,
			history: memoryHistory,
		});
	};

	const renderWithProviders = (ui: React.ReactNode) => {
		const router = createTestRouter();
		return render(
			<Provider>
				<RouterProvider router={router}>{ui}</RouterProvider>
			</Provider>,
		);
	};

	it('基本的なレイアウト構造を持つ', () => {
		const { container } = renderWithProviders(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>,
		);

		// 基本的なレイアウト構造の検証
		const rootDiv = container.firstChild as HTMLElement;
		expect(rootDiv.className).toContain('min-h-screen');

		// 必須のレイアウト要素の存在確認
		expect(container.querySelector('nav')).toBeDefined();
		expect(container.querySelector('main')).toBeDefined();
	});

	it('ナビゲーションリンクが存在する', () => {
		const { container } = renderWithProviders(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>,
		);

		const links = container.querySelectorAll('a');
		const linkTexts = Array.from(links).map((link) => link.textContent);

		expect(linkTexts).toContain('ホーム');
		expect(linkTexts).toContain('フィード管理');
		expect(linkTexts).toContain('About');
	});
});
