import { useAtom } from 'jotai';
import { categoriesAtom } from '../stores/feedStore';
import type { Category } from '../types/feed';
import { nanoid } from 'nanoid';

export const useCategories = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);

  const addCategory = (name: string, color?: string) => {
    const newCategory: Category = {
      id: nanoid(),
      name,
      color
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id'>>) => {
    const newCategories = categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(newCategories);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};