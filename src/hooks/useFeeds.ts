import { useAtom, useAtomValue } from 'jotai';
import { feedsAtom, filteredFeedsAtom, selectedCategoryIdAtom } from '../stores/feedStore';
import type { Feed } from '../types/feed';
import { nanoid } from 'nanoid';

export const useFeeds = () => {
  const [feeds, setFeeds] = useAtom(feedsAtom);
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(selectedCategoryIdAtom);
  const filteredFeeds = useAtomValue(filteredFeedsAtom);

  const addFeed = async (url: string, categoryIds: string[] = []) => {
    const newFeed: Feed = {
      id: nanoid(),
      title: '', // 後でフィードから取得
      url,
      categoryIds,
    };
    
    setFeeds([...feeds, newFeed]);
    return newFeed;
  };

  const updateFeed = (id: string, updates: Partial<Omit<Feed, 'id'>>) => {
    const newFeeds = feeds.map(feed =>
      feed.id === id ? { ...feed, ...updates } : feed
    );
    setFeeds(newFeeds);
  };

  const deleteFeed = (id: string) => {
    setFeeds(feeds.filter(feed => feed.id !== id));
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