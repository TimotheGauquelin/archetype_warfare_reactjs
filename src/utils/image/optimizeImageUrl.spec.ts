import { describe, it, expect } from "vitest";
import { optimizeImageUrl } from "./optimizeImageUrl";

describe("optimizeImageUrl", () => {
  it("returns empty string for empty input", () => {
    expect(optimizeImageUrl("")).toBe("");
    expect(optimizeImageUrl(null)).toBe("");
    expect(optimizeImageUrl(undefined)).toBe("");
  });

  it("keeps ygoprodeck full cards URL (no cards_small)", () => {
    const url = "https://images.ygoprodeck.com/images/cards/123.jpg";
    expect(optimizeImageUrl(url, "card")).toBe(url);
  });

  it("leaves non-cloudinary non-ygoprodeck URLs unchanged", () => {
    const url = "https://example.com/card.jpg";
    expect(optimizeImageUrl(url, "card")).toBe(url);
  });

  it("keeps cloudinary slider URLs at original resolution", () => {
    const url =
      "https://res.cloudinary.com/dqfuwqmql/image/upload/v1763767085/jumbotron_archetypes/abc.png";
    expect(optimizeImageUrl(url, "slider")).toBe(url);
  });

  it("keeps cloudinary card URLs at original resolution", () => {
    const url =
      "https://res.cloudinary.com/dqfuwqmql/image/upload/v1/introduction_archetypes/abc.png";
    expect(optimizeImageUrl(url, "card")).toBe(url);
  });
});
