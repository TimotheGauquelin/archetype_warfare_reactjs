import { describe, it, expect } from "vitest";
import { optimizeImageUrl } from "./optimizeImageUrl";

describe("optimizeImageUrl", () => {
  it("returns empty string for empty input", () => {
    expect(optimizeImageUrl("")).toBe("");
    expect(optimizeImageUrl(null)).toBe("");
    expect(optimizeImageUrl(undefined)).toBe("");
  });

  it("leaves non-cloudinary URLs unchanged", () => {
    const url = "https://images.ygoprodeck.com/images/cards/123.jpg";
    expect(optimizeImageUrl(url, "card")).toBe(url);
  });

  it("injects f_auto,q_auto and width for cloudinary URLs", () => {
    const url =
      "https://res.cloudinary.com/dqfuwqmql/image/upload/v1763767085/jumbotron_archetypes/abc.png";
    expect(optimizeImageUrl(url, "slider")).toBe(
      "https://res.cloudinary.com/dqfuwqmql/image/upload/f_auto,q_auto,c_limit,w_1200/v1763767085/jumbotron_archetypes/abc.png"
    );
  });

  it("does not double-apply transforms", () => {
    const url =
      "https://res.cloudinary.com/dqfuwqmql/image/upload/f_auto,q_auto,c_limit,w_400/v1/folder/x.png";
    expect(optimizeImageUrl(url, "card")).toBe(url);
  });
});
