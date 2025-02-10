import { useAtom, useAtomValue } from 'jotai';
import { feedsAtom, filteredFeedsAtom, selectedCategoryIdAtom } from '../stores/feedStore';
import type { Feed } from '../types/feed';
import { nanoid } from 'nanoid';

export const useFeeds = () => {
  const [feeds, setFeeds] = useAtom(feedsAtom);
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(selectedCategoryIdAtom);
  const filteredFeeds = useAtomValue(filteredFeedsAtom);

  const addFeed = async (url: string, categoryIds: string[] = []) => {
    try {
      // TODO: フィードの検証とメタデータの取得を実装
      const newFeed: Feed = {
        id: nanoid(),
        title: '', // 後でフィードから取得
        url,
        categoryIds,
      };
      
      setFeeds(prev => [...prev, newFeed]);
      return newFeed;
    } catch (error) {
      console.error('Failed to add feed:', error);
      throw error;
    }
  };

  const updateFeed = (id: string, updates: Partial<Omit<Feed, 'id'>>) => {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === id ? { ...feed, ...updates } : feed
      )
    );
  };

  const deleteFeed = (id: string) => {
    setFeeds(prev => prev.filter(feed => feed.id !== id));
  };

  const selectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return {
    feeds,
    filteredFeeds,
    selectedCategoryId,
    addFeed,
    updateFeed,
    deleteFeed,
    selectCategory,
  };
};