import type { Feed } from '~/feed/domain/types/feed';
import { getFeedMetadata } from '~/feed/infrastructure/feed';
import { FeedError } from '~/feed/infrastructure/feed';

export const updateFeed = async (feed: Feed): Promise<Feed> => {
	try {
		// 必要に応じてフィードのメタデータを再取得
		const metadata = await getFeedMetadata(feed.url);
		const updatedFeed = {
			...feed,
			title: metadata.title || feed.title,
			description: metadata.description || feed.description,
			imageUrl: metadata.imageUrl || feed.imageUrl,
			lastUpdated: new Date(),
		};
		return updatedFeed;
	} catch (error) {
		throw new FeedError('フィードの更新に失敗しました');
	}
};

export const deleteFeed = async (feedId: string): Promise<void> => {
	if (!feedId) {
		throw new FeedError('フィードIDが指定されていません');
	}
	// 将来的にはここで永続化層での削除処理を実装
	return Promise.resolve();
};
