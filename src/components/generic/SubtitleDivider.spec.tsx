import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubtitleDivider from "./SubtitleDivider";

describe("SubtitleDivider", () => {
  describe("rendering", () => {
    it("renders the label", () => {
      render(<SubtitleDivider label="Archétypes Populaires" />);
      expect(screen.getByText("Archétypes Populaires")).toBeInTheDocument();
    });

    it("does not render divider when displayDivider is false", () => {
      const { container } = render(<SubtitleDivider label="Titre" displayDivider={false} />);
      expect(container.querySelector(".bg-gray-300")).not.toBeInTheDocument();
    });

    it("renders divider when displayDivider is true", () => {
      const { container } = render(<SubtitleDivider label="Titre" displayDivider />);
      const divider = container.querySelector(".bg-gray-300");
      expect(divider).toBeInTheDocument();
    });

    it("does not render left icon when leftIcon is not provided", () => {
      render(<SubtitleDivider label="Titre" />);
      const images = screen.queryAllByRole("img");
      expect(images).toHaveLength(0);
    });

    it("renders left icon when leftIcon is provided", () => {
      render(<SubtitleDivider label="Titre" leftIcon="/path/to/icon.png" />);
      const img = screen.getByRole("img", { name: "" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/path/to/icon.png");
      expect(img).toHaveClass("w-[40px]", "mr-2");
    });
  });
});
