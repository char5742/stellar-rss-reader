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
});
