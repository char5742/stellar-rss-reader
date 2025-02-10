import { afterEach, describe, expect, it, spyOn } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import type { Feed } from '~/types/feed';
import * as feedUtils from '~/utils/feed';
import { useFeeds } from './useFeeds';

describe('useFeeds', () => {
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<Provider>{children}</Provider>
	);

	afterEach(() => {
		spyOn(feedUtils, 'getFeedMetadata').mockRestore();
	});

	it('初期状態で空の配列を返す', () => {
		const { result } = renderHook(() => useFeeds(), { wrapper });
		expect(result.current.feeds).toEqual([]);
		expect(result.current.filteredFeeds).toEqual([]);
	});

	it('フィードを追加できる', async () => {
		const { result } = renderHook(() => useFeeds(), { wrapper });
		const testUrl = 'https://example.com/feed.xml';
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValue({
			title: 'Test Feed',
			description: 'Test Description',
		});

		await act(async () => {
			await result.current.addFeed(testUrl);
		});
		expect(result.current.feeds).toHaveLength(1);
		expect(result.current.feeds[0].url).toBe(testUrl);
		expect(result.current.feeds[0].title).toBe('Test Feed');
		expect(result.current.feeds[0].description).toBe('Test Description');
	});

	it('フィードを更新できる', async () => {
		const { result } = renderHook(() => useFeeds(), { wrapper });
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValue({
			title: 'Test Feed',
			description: 'Test Description',
		});
		let feed: Feed;

		await act(async () => {
			feed = await result.current.addFeed('https://example.com/feed.xml');
		});
		act(() => {
			result.current.updateFeed(feed.id, { title: 'テストフィード' });
		});

		expect(result.current.feeds[0].title).toBe('テストフィード');
	});

	it('フィードを削除できる', async () => {
		const { result } = renderHook(() => useFeeds(), { wrapper });
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValue({
			title: 'Test Feed',
			description: 'Test Description',
		});
		let feed: Feed;

		await act(async () => {
			feed = await result.current.addFeed('https://example.com/feed.xml');
		});

		act(() => {
			result.current.deleteFeed(feed.id);
		});

		expect(result.current.feeds).toHaveLength(0);
	});

	it('カテゴリーでフィルタリングできる', async () => {
		const { result } = renderHook(() => useFeeds(), { wrapper });
		spyOn(feedUtils, 'getFeedMetadata').mockResolvedValue({
			title: 'Test Feed',
			description: 'Test Description',
		});
		const categoryId = 'test-category';

		await act(async () => {
			await result.current.addFeed('https://example1.com/feed.xml', [
				categoryId,
			]);
		});

		act(() => {
			result.current.selectCategory(categoryId);
		});

		expect(result.current.filteredFeeds[0].categoryIds).toContain(categoryId);
	});
});
