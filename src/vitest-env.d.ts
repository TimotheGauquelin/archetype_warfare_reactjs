import type { TestingLibraryMatchers } from "testing-library__jest-dom/matchers";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}

export {};
