import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import * as feedUtils from '~/utils/feed';
import { AddFeedForm } from './AddFeedForm';

describe('AddFeedForm', () => {
	const renderWithProvider = (ui: React.ReactNode) => {
		return render(<Provider>{ui}</Provider>);
	};

	beforeEach(() => {
		// フィードユーティリティのモック（bunのspyOnを使用）
		spyOn(feedUtils, 'validateFeedUrl').mockImplementation(async () => true);
		spyOn(feedUtils, 'getFeedMetadata').mockImplementation(async () => ({
			title: 'Test Feed',
			description: 'Test Description',
		}));
	});
	afterEach(() => {
		cleanup();
		spyOn(feedUtils, 'validateFeedUrl').mockRestore();
		spyOn(feedUtils, 'getFeedMetadata').mockRestore();
	});

	it('フォームの初期状態が正しい', () => {
		renderWithProvider(<AddFeedForm />);
		expect(screen.getByLabelText(/フィードURL/i)).toBeDefined();
		expect(screen.getByText(/^フィードを追加/i)).toBeDefined();
	});

	it('URLの入力を受け付ける', () => {
		renderWithProvider(<AddFeedForm />);
		const input = screen.getByLabelText(/フィードURL/i) as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: 'https://example.com/feed.xml' },
		});
		expect(input.value).toBe('https://example.com/feed.xml');
	});

	it('無効なURLの場合はエラーを表示する', async () => {
		renderWithProvider(<AddFeedForm />);
		// こちらでもspyOnを再度利用し、mockRejectedValueOnceでエラーを投げる
		spyOn(feedUtils, 'validateFeedUrl').mockImplementation(async () => {
			throw new Error('無効なURL');
		});

		const input = screen.getByLabelText(/フィードURL/i);
		const submitButton = screen.getByText(/^フィードを追加/i);

		fireEvent.change(input, {
			target: { value: 'https://example.com/feed.xml' },
		});
		fireEvent.click(submitButton);

		const errorMessage = await screen.findByText(/無効なURL/i);
		expect(errorMessage).toBeDefined();
	});

	it('フォーム送信時にバリデーションと更新が行われる', async () => {
		renderWithProvider(<AddFeedForm />);
		const input = screen.getByLabelText(/フィードURL/i);
		const submitButton = screen.getByText(/^フィードを追加/i);

		fireEvent.change(input, {
			target: { value: 'https://example.com/feed.xml' },
		});
		fireEvent.click(submitButton);

		await expect(feedUtils.validateFeedUrl).toHaveBeenCalledWith(
			'https://example.com/feed.xml',
		);
		await expect(feedUtils.getFeedMetadata).toHaveBeenCalledWith(
			'https://example.com/feed.xml',
		);
	});
});
