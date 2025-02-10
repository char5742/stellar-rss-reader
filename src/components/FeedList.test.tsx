import { afterEach, describe, expect, it, spyOn } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { categoriesAtom, feedsAtom } from '../stores/feedStore';
import * as feedUtils from '../utils/feed';
import { FeedList } from './FeedList';

const mockFeeds = [
	{
		id: '1',
		title: 'Test Feed 1',
		url: 'https://example.com/feed1.xml',
		categoryIds: ['cat1'],
		description: 'Test Description 1',
		lastUpdated: new Date('2024-01-01'),
	},
	{
		id: '2',
		title: 'Test Feed 2',
		url: 'https://example.com/feed2.xml',
		categoryIds: ['cat2'],
		description: 'Test Description 2',
		lastUpdated: new Date('2024-01-02'),
	},
];

const mockCategories = [
	{ id: 'cat1', name: 'Category 1', color: '#ff0000' },
	{ id: 'cat2', name: 'Category 2', color: '#00ff00' },
];

const HydrateAtoms = ({
	initialValues,
	children,
}: {
	initialValues: Array<
		| [typeof categoriesAtom, typeof mockCategories]
		| [typeof feedsAtom, typeof mockFeeds]
	>;
	children: React.ReactNode;
}) => {
	useHydrateAtoms(initialValues);
	return children;
};

describe('FeedList', () => {
	const renderWithProvider = (
		ui: React.ReactNode,
		{
			feeds = [] as typeof mockFeeds,
			categories = [] as typeof mockCategories,
		} = {},
	) => {
		return render(
			<Provider>
				<HydrateAtoms
					initialValues={[
						[feedsAtom, feeds],
						[categoriesAtom, categories],
					]}
				>
					{ui}
				</HydrateAtoms>
			</Provider>,
		);
	};
	afterEach(() => {
		cleanup();
		spyOn(feedUtils, 'getFeedMetadata').mockRestore();
	});

	it('フィードが空の場合、適切なメッセージを表示する', () => {
		renderWithProvider(<FeedList />);
		expect(
			screen.getByText(/登録されているフィードはありません/),
		).toBeDefined();
	});

	it('フィードのリストを表示する', () => {
		renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		expect(screen.getByText('Test Feed 1')).toBeDefined();
		expect(screen.getByText('Test Feed 2')).toBeDefined();
	});

	it('カテゴリーでフィルタリングできる', () => {
		renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		const select = screen.getByLabelText(/カテゴリーでフィルター/i);
		fireEvent.change(select, { target: { value: 'cat1' } });

		expect(screen.getByText('Test Feed 1')).toBeDefined();
		expect(screen.queryByText('Test Feed 2')).toBeNull();
	});

	it('フィードを更新できる', async () => {
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValueOnce({
			title: 'Updated Feed',
			description: 'Updated Description',
		});

		renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		const refreshButtons = screen.getAllByTitle('フィードを更新');
		fireEvent.click(refreshButtons[0]);

		expect(feedUtils.getFeedMetadata).toHaveBeenCalledWith(mockFeeds[0].url);
	});

	it('すべてのフィードを更新できる', async () => {
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValue({
			title: 'Updated Feed',
			description: 'Updated Description',
		});

		renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		const refreshAllButton = screen.getByText('すべて更新');
		fireEvent.click(refreshAllButton);

		expect(feedUtils.getFeedMetadata).toHaveBeenCalledTimes(2);
	});

	it('フィードの編集が行える', async () => {
		renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		// 編集ボタンをクリック
		const editButton = screen.getByText('編集');
		fireEvent.click(editButton);

		// タイトル入力
		const titleInput = screen.getByDisplayValue('Test Feed 1');
		fireEvent.change(titleInput, { target: { value: 'Updated Feed Title' } });

		// 保存ボタンをクリック
		const saveButton = screen.getByText('保存');
		fireEvent.click(saveButton);

		// 更新されたタイトルが表示されていることを確認
		expect(screen.getByText('Updated Feed Title')).toBeDefined();
	});

	it('フィードの削除が行える', async () => {
		const { container } = renderWithProvider(<FeedList />, {
			feeds: mockFeeds,
			categories: mockCategories,
		});

		// 削除前のフィード数を確認
		const feedsBefore = container.querySelectorAll('.feed-item').length;

		// 削除ボタンをクリック
		const deleteButton = screen.getAllByText('削除')[0];
		fireEvent.click(deleteButton);

		// 確認ダイアログでOKを選択
		window.confirm = () => true;

		// 削除後のフィード数を確認
		const feedsAfter = container.querySelectorAll('.feed-item').length;
		expect(feedsAfter).toBe(feedsBefore - 1);
	});
});
