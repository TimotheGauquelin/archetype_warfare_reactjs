import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { laborIllusion } from "./laborIllusion";

describe("laborIllusion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("don't call the callback immediately", () => {
    const callback = vi.fn();
    laborIllusion(callback, 0.5);

    expect(callback).not.toHaveBeenCalled();
  });

  it("call the callback after the specified delay", () => {
    const callback = vi.fn();
    laborIllusion(callback, 0.5);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("call the callback with the correct arguments if provided", () => {
    const callback = vi.fn();
    const testArg = "test argument";

    laborIllusion(() => callback(testArg), 0.5);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledWith(testArg);
  });
});
