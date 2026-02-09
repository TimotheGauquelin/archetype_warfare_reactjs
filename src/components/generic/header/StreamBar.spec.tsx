import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StreamBar from "./StreamBar";
import { TWITCH_URL } from "@/utils/const/extraLink";

describe("StreamBar", () => {
  it("renders a link to the Twitch channel", () => {
    render(<StreamBar />);
    const link = screen.getByRole("link", { name: /Archetype Battle/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", TWITCH_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
