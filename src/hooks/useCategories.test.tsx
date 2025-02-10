import { describe, expect, it } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'jotai';
import { useCategories } from './useCategories';

describe('useCategories', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  it('初期状態で空の配列を返す', () => {
    const { result } = renderHook(() => useCategories(), { wrapper });
    expect(result.current.categories).toEqual([]);
  });

  it('カテゴリーを追加できる', () => {
    const { result } = renderHook(() => useCategories(), { wrapper });
    
    act(() => {
      result.current.addCategory('テクノロジー', '#ff0000');
    });

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0]).toMatchObject({
      name: 'テクノロジー',
      color: '#ff0000'
    });
  });

  it('カテゴリーを更新できる', () => {
    const { result } = renderHook(() => useCategories(), { wrapper });
    let categoryId: string;
    
    act(() => {
      const category = result.current.addCategory('テクノロジー');
      categoryId = category.id;
    });

    act(() => {
      result.current.updateCategory(categoryId, { name: '技術' });
    });

    expect(result.current.categories[0].name).toBe('技術');
  });

  it('カテゴリーを削除できる', () => {
    const { result } = renderHook(() => useCategories(), { wrapper });
    let categoryId: string;
    
    act(() => {
      const category = result.current.addCategory('テクノロジー');
      categoryId = category.id;
    });

    act(() => {
      result.current.deleteCategory(categoryId);
    });

    expect(result.current.categories).toHaveLength(0);
  });
});