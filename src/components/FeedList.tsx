import { useFeeds } from '../hooks/useFeeds';
import { useCategories } from '../hooks/useCategories';
import type { Feed } from '../types/feed';

const FeedItem = ({ feed }: { feed: Feed }) => {
  const { categories } = useCategories();
  const { deleteFeed } = useFeeds();

  const feedCategories = categories.filter(cat => 
    feed.categoryIds.includes(cat.id)
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{feed.title || feed.url}</h3>
          {feed.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-2">{feed.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {feedCategories.map(category => (
              <span
                key={category.id}
                className="px-2 py-1 text-sm rounded-full"
                style={{
                  backgroundColor: category.color || '#e2e8f0',
                  color: category.color ? '#ffffff' : '#1a202c'
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => deleteFeed(feed.id)}
          className="text-red-500 hover:text-red-600"
          aria-label="フィードを削除"
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
  );
};

export const FeedList = () => {
  const { filteredFeeds, selectedCategoryId, selectCategory } = useFeeds();
  const { categories } = useCategories();

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">カテゴリーでフィルター</label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => selectCategory(e.target.value || null)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        >
          <option value="">すべて表示</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredFeeds.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            登録されているフィードはありません
          </p>
        ) : (
          filteredFeeds.map(feed => (
            <FeedItem key={feed.id} feed={feed} />
          ))
        )}
      </div>
    </div>
  );
};