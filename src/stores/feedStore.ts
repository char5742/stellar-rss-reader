import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Feed, Category } from '../types/feed';

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
  
  return feeds.filter(feed => 
    feed.categoryIds.includes(selectedCategoryId)
  );
});