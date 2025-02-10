import { afterEach, describe, expect, it } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { categoriesAtom } from '../stores/feedStore';
import { CategoryManager } from './CategoryManager';

const mockCategories = [
	{ id: 'cat1', name: 'Category 1', color: '#ff0000' },
	{ id: 'cat2', name: 'Category 2', color: '#00ff00' },
];

const HydrateAtoms = ({
	initialValues,
	children,
}: {
	initialValues: [[typeof categoriesAtom, typeof mockCategories]];
	children: React.ReactNode;
}) => {
	useHydrateAtoms(initialValues);
	return children;
};

describe('CategoryManager', () => {
	const renderWithProvider = (
		ui: React.ReactNode,
		{ categories = [] as typeof mockCategories } = {},
	) => {
		return render(
			<Provider>
				<HydrateAtoms initialValues={[[categoriesAtom, categories]]}>
					{ui}
				</HydrateAtoms>
			</Provider>,
		);
	};

	afterEach(cleanup);

	it('カテゴリーが空の場合、適切なメッセージを表示する', () => {
		renderWithProvider(<CategoryManager />);
		expect(screen.getByText(/カテゴリーはまだありません/)).toBeDefined();
	});

	it('カテゴリーのリストを表示する', () => {
		renderWithProvider(<CategoryManager />, { categories: mockCategories });

		expect(screen.getByText('Category 1')).toBeDefined();
		expect(screen.getByText('Category 2')).toBeDefined();
	});

	it('新しいカテゴリーを追加できる', () => {
		renderWithProvider(<CategoryManager />);

		const nameInput = screen.getByLabelText(/カテゴリー名/i);
		const colorInput = screen.getByLabelText(/カラー/i);
		const submitButton = screen.getByText('追加');

		fireEvent.change(nameInput, { target: { value: 'New Category' } });
		fireEvent.change(colorInput, { target: { value: '#0000ff' } });
		fireEvent.click(submitButton);

		expect(screen.getByText('New Category')).toBeDefined();
	});

	it('カテゴリーを編集できる', () => {
		renderWithProvider(<CategoryManager />, { categories: mockCategories });

		// 編集モードを開始
		const editButtons = screen.getAllByText('編集');
		fireEvent.click(editButtons[0]);

		// フォームに新しい値を入力
		const nameInput = screen.getByLabelText(/カテゴリー名/i);
		fireEvent.change(nameInput, { target: { value: 'Updated Category' } });

		// 更新を実行
		const updateButton = screen.getByText('更新');
		fireEvent.click(updateButton);

		expect(screen.getByText('Updated Category')).toBeDefined();
	});

	it('カテゴリーを削除できる', () => {
		renderWithProvider(<CategoryManager />, { categories: mockCategories });

		const deleteButtons = screen.getAllByText('削除');
		fireEvent.click(deleteButtons[0]);

		expect(screen.queryByText('Category 1')).toBeNull();
		expect(screen.getByText('Category 2')).toBeDefined();
	});
});
