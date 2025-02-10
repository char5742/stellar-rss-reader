import { describe, expect, it } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'jotai';
import { useFeeds } from './useFeeds';

describe('useFeeds', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  it('初期状態で空の配列を返す', () => {
    const { result } = renderHook(() => useFeeds(), { wrapper });
    expect(result.current.feeds).toEqual([]);
    expect(result.current.filteredFeeds).toEqual([]);
  });

  it('フィードを追加できる', async () => {
    const { result } = renderHook(() => useFeeds(), { wrapper });
    const testUrl = 'https://example.com/feed.xml';
    
    await act(async () => {
      await result.current.addFeed(testUrl);
    });

    expect(result.current.feeds).toHaveLength(1);
    expect(result.current.feeds[0]).toMatchObject({
      url: testUrl
    });
  });

  it('フィードを更新できる', async () => {
    const { result } = renderHook(() => useFeeds(), { wrapper });
    let feedId: string;
    
    await act(async () => {
      const feed = await result.current.addFeed('https://example.com/feed.xml');
      feedId = feed.id;
      result.current.updateFeed(feedId, { title: 'テストフィード' });
    });

    expect(result.current.feeds[0].title).toBe('テストフィード');
  });

  it('フィードを削除できる', async () => {
    const { result } = renderHook(() => useFeeds(), { wrapper });
    
    await act(async () => {
      const feed = await result.current.addFeed('https://example.com/feed.xml');
      result.current.deleteFeed(feed.id);
    });

    expect(result.current.feeds).toHaveLength(0);
  });

  it('カテゴリーでフィルタリングできる', async () => {
    const { result } = renderHook(() => useFeeds(), { wrapper });
    const categoryId = 'test-category';
    
    await act(async () => {
      await result.current.addFeed('https://example1.com/feed.xml', [categoryId]);
      await result.current.addFeed('https://example2.com/feed.xml');
    });

    act(() => {
      result.current.selectCategory(categoryId);
    });

    expect(result.current.filteredFeeds).toHaveLength(1);
    expect(result.current.filteredFeeds[0].categoryIds).toContain(categoryId);
  });
});