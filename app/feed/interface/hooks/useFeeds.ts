import { useAtom, useAtomValue } from 'jotai';
import { nanoid } from 'nanoid';
import type { Feed } from '~/feed/domain/types/feed';
import { getFeedMetadata } from '~/feed/infrastructure/feed';
import {
	feedsAtom,
	filteredFeedsAtom,
	selectedCategoryIdAtom,
} from '~/feed/interface/stores/feedStore';

export const useFeeds = () => {
	const [feeds, setFeeds] = useAtom(feedsAtom);
	const [selectedCategoryId, setSelectedCategoryId] = useAtom(
		selectedCategoryIdAtom,
	);
	const filteredFeeds = useAtomValue(filteredFeedsAtom);

	const addFeed = async (url: string, categoryIds: string[] = []) => {
		try {
			// フィードのメタデータを取得
			const metadata = await getFeedMetadata(url);

			const newFeed: Feed = {
				id: nanoid(),
				title: metadata.title,
				url,
				categoryIds,
				description: metadata.description,
				imageUrl: metadata.imageUrl,
				lastUpdated: new Date(),
			};

			setFeeds([...feeds, newFeed]);
			return newFeed;
		} catch (error) {
			console.error('Failed to add feed:', error);
			throw error;
		}
	};

	const updateFeed = async (id: string, updates: Partial<Omit<Feed, 'id'>>) => {
		const updatedFeeds = feeds.map((feed) =>
			feed.id === id ? { ...feed, ...updates } : feed,
		);
		setFeeds(updatedFeeds);
	};

	const refreshFeed = async (id: string) => {
		const feed = feeds.find((f) => f.id === id);
		if (!feed) return;

		try {
			const metadata = await getFeedMetadata(feed.url);
			await updateFeed(id, {
				title: metadata.title,
				description: metadata.description,
				imageUrl: metadata.imageUrl,
				lastUpdated: new Date(),
			});
		} catch (error) {
			console.error('Failed to refresh feed:', error);
			throw error;
		}
	};

	const deleteFeed = (id: string) => {
		setFeeds(feeds.filter((feed) => feed.id !== id));
	};

	const selectCategory = (categoryId: string | null) => {
		setSelectedCategoryId(categoryId);
	};

	return {
		selectCategory,
		deleteFeed,
		refreshFeed,
		updateFeed,
		addFeed,
		selectedCategoryId,
		filteredFeeds,
		feeds,
	};
};
