import '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { render } from '@testing-library/react';
import { RootLayout } from './RootLayout';
import { Provider } from 'jotai';

describe('RootLayout', () => {
	const renderWithProvider = (ui: React.ReactNode) => {
		return render(<Provider>{ui}</Provider>);
	};

	it('子要素を正しくレンダリングする', () => {
		const testContent = 'Test Content';
		const { getByText } = renderWithProvider(
			<RootLayout>
				<div>{testContent}</div>
			</RootLayout>,
		);

		expect(getByText(testContent)).toBeDefined();
	});

	it('テーマクラスが適用される', () => {
		const { container } = renderWithProvider(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>,
		);

		const rootDiv = container.firstChild as HTMLElement;
		expect(rootDiv.className).toContain('min-h-screen');
	});
});
