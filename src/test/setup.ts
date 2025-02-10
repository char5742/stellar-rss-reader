import { afterEach } from 'bun:test';
import { registerDOM } from '@happy-dom/global-registrator';
import { cleanup } from '@testing-library/react';

// Register happy-dom
registerDOM();

// Cleanup after each test
afterEach(() => {
	cleanup();
});
