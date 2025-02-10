import { useAtom } from 'jotai';
import { useState } from 'react';
import { deleteFeed, updateFeed } from '~/feed/application/usecase';
import type { Feed } from '~/feed/domain/types/feed';
import { useCategories } from '~/feed/interface/hooks/useCategories';
import { useFeeds } from '~/feed/interface/hooks/useFeeds';
import { feedManagementAtom } from '~/feed/interface/stores/feedStore';

export const FeedList = () => {
	const { filteredFeeds, selectedCategoryId, selectCategory } = useFeeds();
	const { categories } = useCategories();
	const [isRefreshingAll, setIsRefreshingAll] = useState(false);
	const { refreshFeed } = useFeeds();
	const [, dispatch] = useAtom(feedManagementAtom);
	const [editingFeed, setEditingFeed] = useState<Feed | null>(null);

	const handleRefreshAll = async () => {
		setIsRefreshingAll(true);
		try {
			await Promise.all(filteredFeeds.map((feed) => refreshFeed(feed.id)));
		} finally {
			setIsRefreshingAll(false);
		}
	};

	const handleEdit = async (feed: Feed) => {
		try {
			const updatedFeed = await updateFeed(feed);
			dispatch({ type: 'update', payload: updatedFeed });
		} catch (error) {
			console.error('フィードの更新に失敗しました:', error);
		}
	};

	const handleDelete = async (feedId: string) => {
		if (!window.confirm('このフィードを削除してもよろしいですか？')) {
			return;
		}
		try {
			await deleteFeed(feedId);
			dispatch({ type: 'delete', payload: feedId });
		} catch (error) {
			console.error('フィードの削除に失敗しました:', error);
		}
	};

	return (
		<main className="p-4">
			<header className="flex justify-between items-center mb-4">
				<label className="flex-grow block text-sm font-medium mb-2">
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

				<button
					type="button"
					onClick={handleRefreshAll}
					disabled={isRefreshingAll || filteredFeeds.length === 0}
					className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:hover:bg-blue-500 flex items-center"
				>
					<svg
						role="presentation"
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
			</header>

			{/* 見出しとリストの関連付け */}
			<h2 id="feed-list-heading" className="text-lg font-semibold mb-2">
				フィード一覧 ({filteredFeeds.length}件)
			</h2>

			{filteredFeeds.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400 py-8">
					{selectedCategoryId
						? '選択したカテゴリーのフィードはありません'
						: '登録されているフィードはありません'}
				</p>
			) : (
				<ul className="space-y-4" aria-labelledby="feed-list-heading">
					{filteredFeeds.map((feed) => (
						<li
							key={feed.id}
							className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
						>
							{editingFeed?.id === feed.id ? (
								<section className="space-y-2">
									<input
										type="text"
										value={editingFeed.title}
										onChange={(e) =>
											setEditingFeed({ ...editingFeed, title: e.target.value })
										}
										className="w-full px-3 py-2 border rounded"
									/>
									<div className="flex space-x-2">
										<button
											type="button"
											onClick={() => {
												handleEdit(editingFeed);
												setEditingFeed(null);
											}}
											className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										>
											保存
										</button>
										<button
											type="button"
											onClick={() => setEditingFeed(null)}
											className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
										>
											キャンセル
										</button>
									</div>
								</section>
							) : (
								<article className="flex items-center justify-between">
									<div>
										<h3 className="text-lg font-semibold">{feed.title}</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{feed.url}
										</p>
									</div>
									<nav className="flex space-x-2">
										<button
											type="button"
											onClick={() => setEditingFeed(feed)}
											className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
										>
											編集
										</button>
										<button
											type="button"
											onClick={() => handleDelete(feed.id)}
											className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
										>
											削除
										</button>
									</nav>
								</article>
							)}
						</li>
					))}
				</ul>
			)}
		</main>
	);
};
