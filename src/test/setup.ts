import { afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';
import { registerDOM } from '@happy-dom/global-registrator';

// Register happy-dom
registerDOM();

// Cleanup after each test
afterEach(() => {
	cleanup();
});
