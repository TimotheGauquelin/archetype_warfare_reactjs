import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Suppress known deprecation warning from @testing-library/react (uses react-dom/test-utils.act)
const suppressActDeprecation = (args: unknown[]): boolean => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  return msg.includes('ReactDOMTestUtils.act') && msg.includes('deprecated');
};
beforeAll(() => {
  const originalWarn = console.warn;
  const originalError = console.error;
  console.warn = (...args: unknown[]) => {
    if (suppressActDeprecation(args)) return;
    originalWarn.apply(console, args);
  };
  console.error = (...args: unknown[]) => {
    if (suppressActDeprecation(args)) return;
    originalError.apply(console, args);
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
