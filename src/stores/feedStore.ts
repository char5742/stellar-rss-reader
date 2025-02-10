import { atom } from 'jotai';
import type { Category, Feed } from '../types/feed';

// カテゴリーの永続化ストア
export const categoriesAtom = atom<Category[]>([]);

// フィードの永続化ストア
export const feedsAtom = atom<Feed[]>([]);

// 選択中のカテゴリーID
export const selectedCategoryIdAtom = atom<string | null>(null);

// フィルタリングされたフィード一覧を取得する派生atom
export const filteredFeedsAtom = atom((get) => {
	const feeds = get(feedsAtom);
	const selectedCategoryId = get(selectedCategoryIdAtom);

	if (!selectedCategoryId) return feeds;

	return feeds.filter((feed) => feed.categoryIds.includes(selectedCategoryId));
});

// アクションを含むフィード管理atom
export const feedManagementAtom = atom(
	(get) => get(feedsAtom),
	(get, set, action: { type: 'update' | 'delete'; payload: Feed | string }) => {
		const feeds = get(feedsAtom);

		switch (action.type) {
			case 'update': {
				const updatedFeed = action.payload as Feed;
				set(
					feedsAtom,
					feeds.map((feed) =>
						feed.id === updatedFeed.id ? updatedFeed : feed,
					),
				);
				break;
			}

			case 'delete': {
				const feedId = action.payload as string;
				set(
					feedsAtom,
					feeds.filter((feed) => feed.id !== feedId),
				);
				break;
			}
		}
	},
);
