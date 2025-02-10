import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/feed';

interface CategoryFormProps {
  onSubmit: (name: string, color: string) => void;
  initialValues?: Partial<Category>;
  submitLabel: string;
}

const CategoryForm = ({ onSubmit, initialValues, submitLabel }: CategoryFormProps) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [color, setColor] = useState(initialValues?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, color);
    setName('');
    setColor('#3b82f6');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="block text-sm font-medium mb-1">
          カテゴリー名
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
      <div>
        <label htmlFor="category-color" className="block text-sm font-medium mb-1">
          カラー
        </label>
        <input
          id="category-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-1 border rounded h-10"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        {editingCategory ? 'カテゴリーを編集' : 'カテゴリーを追加'}
      </h2>
      
      <CategoryForm
        onSubmit={(name, color) => {
          if (editingCategory) {
            updateCategory(editingCategory.id, { name, color });
            setEditingCategory(null);
          } else {
            addCategory(name, color);
          }
        }}
        initialValues={editingCategory || undefined}
        submitLabel={editingCategory ? '更新' : '追加'}
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">カテゴリー一覧</h3>
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              カテゴリーはまだありません
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};