import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Slide from "./Slide";
import type { Archetype } from "../../../types";

const baseArchetype: Archetype = {
  id: 1,
  name: "Dark Magician",
  slider_info: "The legendary spellcaster",
  slider_img_url: "https://example.com/slider.jpg",
};

function renderSlide(props: Partial<React.ComponentProps<typeof Slide>> = {}) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Slide archetype={props.archetype ?? baseArchetype} imageVisible={props.imageVisible} showText={props.showText} />
    </MemoryRouter>
  );
}

describe("Slide", () => {
  describe("rendering", () => {
    it("renders archetype name and subtitle", () => {
      renderSlide();
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
      expect(screen.getByText("The legendary spellcaster")).toBeInTheDocument();
    });

    it("renders welcome title when name is missing", () => {
      renderSlide({ archetype: { ...baseArchetype, name: "" } });
      expect(screen.getByText("Bienvenue sur ArchetypeBattle")).toBeInTheDocument();
    });

    it("renders image with slider_img_url and alt", () => {
      renderSlide();
      const img = screen.getByRole("img", { name: "Dark Magician" });
      expect(img).toHaveAttribute("src", baseArchetype.slider_img_url);
    });
  });

  describe("link Découvrir", () => {
    it("shows link to archetype when not welcome slide and id exists", () => {
      renderSlide();
      const link = screen.getByRole("link", { name: /Découvrir/i });
      expect(link).toHaveAttribute("href", "/archetype/1");
    });

    it("does not show link when isWelcome", () => {
      renderSlide({ archetype: { ...baseArchetype, isWelcome: true } });
      expect(screen.queryByRole("link", { name: /Découvrir/i })).not.toBeInTheDocument();
    });

    it("does not show link when archetype has no id", () => {
      renderSlide({ archetype: { ...baseArchetype, id: undefined as unknown as number } });
      expect(screen.queryByRole("link", { name: /Découvrir/i })).not.toBeInTheDocument();
    });
  });

  describe("imageVisible and showText", () => {
    it("image container has opacity-100 when imageVisible is true", () => {
      const { container } = renderSlide({ imageVisible: true });
      const imageWrapper = container.querySelector(".opacity-100");
      expect(imageWrapper).toBeInTheDocument();
    });

    it("image container has opacity-0 when imageVisible is false", () => {
      const { container } = renderSlide({ imageVisible: false });
      const imageWrappers = container.querySelectorAll("[class*='opacity']");
      const hasOpacity0 = Array.from(imageWrappers).some((el) => el.className.includes("opacity-0"));
      expect(hasOpacity0).toBe(true);
    });

    it("title has visible classes when showText is true", () => {
      renderSlide({ showText: true });
      const title = screen.getByText("Dark Magician").closest("h2");
      expect(title).toHaveClass("translate-x-0", "opacity-100");
    });

    it("title has hidden classes when showText is false", () => {
      renderSlide({ showText: false });
      const title = screen.getByText("Dark Magician").closest("h2");
      expect(title).toHaveClass("-translate-x-full", "opacity-0");
    });
  });
});
