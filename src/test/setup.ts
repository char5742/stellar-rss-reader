import { registerDOM } from '@happy-dom/global-registrator';
import { afterEach, beforeAll } from 'bun:test';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/matchers';

// Register happy-dom
registerDOM();

// グローバルなテスト設定
beforeAll(() => {
  // TanStack Routerのエラー抑制
  const consoleError = console.error;
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('useRouter must be used')) {
      return;
    }
    consoleError(...args);
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
