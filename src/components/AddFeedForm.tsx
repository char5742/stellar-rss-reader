import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useFeeds } from '../hooks/useFeeds';
import { validateFeedUrl } from '../utils/feed';

export const AddFeedForm = () => {
	const [url, setUrl] = useState('');
	const [isValidating, setIsValidating] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const { categories } = useCategories();
	const { addFeed } = useFeeds();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsValidating(true);

		try {
			await validateFeedUrl(url);
			// URLの検証と追加
			await addFeed(url, selectedCategories);

			// フォームのリセット
			setUrl('');
			setSelectedCategories([]);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'フィードの追加に失敗しました',
			);
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
		>
			<h2 className="text-xl font-bold mb-4">新しいフィードを追加</h2>

			<div className="mb-4">
				<label htmlFor="feed-url" className="block text-sm font-medium mb-1">
					フィードURL
				</label>
				<input
					id="feed-url"
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://example.com/feed.xml"
					required
					disabled={isValidating}
					className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 disabled:opacity-50"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">カテゴリー</label>
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => (
						<label key={category.id} className="inline-flex items-center">
							<input
								type="checkbox"
								checked={selectedCategories.includes(category.id)}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedCategories([...selectedCategories, category.id]);
									} else {
										setSelectedCategories(
											selectedCategories.filter((id) => id !== category.id),
										);
									}
								}}
								disabled={isValidating}
								className="mr-1"
							/>
							<span style={{ color: category.color }}>{category.name}</span>
						</label>
					))}
				</div>
			</div>

			{error && (
				<div className="mb-4 p-2 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded">
					{error}
				</div>
			)}

			<button
				type="submit"
				disabled={isValidating}
				className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:hover:bg-blue-500"
			>
				{isValidating ? 'フィードを検証中...' : 'フィードを追加'}
			</button>
		</form>
	);
};
