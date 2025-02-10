import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useFeeds } from '../hooks/useFeeds';
import type { Feed } from '../types/feed';

const FeedItem = ({ feed }: { feed: Feed }) => {
	const { categories } = useCategories();
	const { deleteFeed, refreshFeed } = useFeeds();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		setError(null);
		try {
			await refreshFeed(feed.id);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'フィードの更新に失敗しました',
			);
		} finally {
			setIsRefreshing(false);
		}
	};

	const feedCategories = categories.filter((cat) =>
		feed.categoryIds.includes(cat.id),
	);

	return (
		<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
			<div className="flex justify-between items-start">
				<div className="flex-grow">
					<div className="flex items-start justify-between mb-2">
						<h3 className="text-lg font-semibold">{feed.title || feed.url}</h3>
						<div className="flex items-center space-x-2">
							<button
								onClick={handleRefresh}
								disabled={isRefreshing}
								className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
								title="フィードを更新"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
							<button
								onClick={() => deleteFeed(feed.id)}
								className="text-red-500 hover:text-red-600"
								title="フィードを削除"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
					{feed.description && (
						<p className="text-gray-600 dark:text-gray-300 mb-2">
							{feed.description}
						</p>
					)}
					{feed.lastUpdated && (
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
							最終更新: {new Date(feed.lastUpdated).toLocaleString()}
						</p>
					)}
					<div className="flex flex-wrap gap-2">
						{feedCategories.map((category) => (
							<span
								key={category.id}
								className="px-2 py-1 text-sm rounded-full"
								style={{
									backgroundColor: category.color || '#e2e8f0',
									color: category.color ? '#ffffff' : '#1a202c',
								}}
							>
								{category.name}
							</span>
						))}
					</div>
				</div>
			</div>
			{error && (
				<div className="mt-2 p-2 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded text-sm">
					{error}
				</div>
			)}
		</div>
	);
};

export const FeedList = () => {
	const { filteredFeeds, selectedCategoryId, selectCategory } = useFeeds();
	const { categories } = useCategories();
	const [isRefreshingAll, setIsRefreshingAll] = useState(false);
	const { refreshFeed } = useFeeds();

	const handleRefreshAll = async () => {
		setIsRefreshingAll(true);
		try {
			await Promise.all(filteredFeeds.map((feed) => refreshFeed(feed.id)));
		} finally {
			setIsRefreshingAll(false);
		}
	};

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex-grow">
					<label className="block text-sm font-medium mb-2">
						カテゴリーでフィルター
						<select
							value={selectedCategoryId || ''}
							onChange={(e) => selectCategory(e.target.value || null)}
							className="w-full md:w-64 p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
						>
							<option value="">すべて表示</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</label>
				</div>
				<button
					onClick={handleRefreshAll}
					disabled={isRefreshingAll || filteredFeeds.length === 0}
					className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:hover:bg-blue-500 flex items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-5 w-5 mr-2 ${isRefreshingAll ? 'animate-spin' : ''}`}
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
							clipRule="evenodd"
						/>
					</svg>
					{isRefreshingAll ? '更新中...' : 'すべて更新'}
				</button>
			</div>

			<div>
				{filteredFeeds.length === 0 ? (
					<p className="text-center text-gray-500 dark:text-gray-400 py-8">
						{selectedCategoryId
							? '選択したカテゴリーのフィードはありません'
							: '登録されているフィードはありません'}
					</p>
				) : (
					filteredFeeds.map((feed) => <FeedItem key={feed.id} feed={feed} />)
				)}
			</div>
		</div>
	);
};
