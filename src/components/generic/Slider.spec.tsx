import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Slider from "./Slider";
import type { Archetype } from "../../types";

function renderSlider(props: React.ComponentProps<typeof Slider>) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Slider {...props} />
    </MemoryRouter>
  );
}

const mockArchetypes: Archetype[] = [
  {
    id: 1,
    name: "Dark Magician",
    slider_info: "Info 1",
    slider_img_url: "https://example.com/1.jpg",
  },
  {
    id: 2,
    name: "Blue-Eyes",
    slider_info: "Info 2",
    slider_img_url: "https://example.com/2.jpg",
  },
  {
    id: 3,
    name: "Stardust",
    slider_info: "Info 3",
    slider_img_url: "https://example.com/3.jpg",
  },
];

describe("Slider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when array is empty", () => {
    it("returns null", () => {
      const { container } = renderSlider({ array: [] });
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when array has items", () => {
    it("renders first slide by default", () => {
      renderSlider({ array: mockArchetypes });
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
      expect(screen.getByText("Info 1")).toBeInTheDocument();
    });

    it("renders slide image with correct src and alt", () => {
      renderSlider({ array: mockArchetypes });
      const img = screen.getByRole("img", { name: "Dark Magician" });
      expect(img).toHaveAttribute("src", mockArchetypes[0].slider_img_url);
    });

    it("does not show dots when totalSlides <= slidesPerView", () => {
      renderSlider({ array: mockArchetypes.slice(0, 1), slidesPerView: 1 });
      expect(screen.queryByRole("button", { name: /Aller au slide/ })).not.toBeInTheDocument();
    });

    it("shows dots when totalSlides > slidesPerView", () => {
      renderSlider({ array: mockArchetypes, slidesPerView: 1 });
      expect(screen.getByRole("button", { name: "Aller au slide 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Aller au slide 2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Aller au slide 3" })).toBeInTheDocument();
    });

    it("clicking dot goes to corresponding slide", () => {
      renderSlider({ array: mockArchetypes, slidesPerView: 1 });
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();

      const slide2Button = screen.getByRole("button", { name: "Aller au slide 2" });
      act(() => {
        slide2Button.click();
      });

      act(() => {
        vi.advanceTimersByTime(600);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
      expect(screen.getByText("Info 2")).toBeInTheDocument();
    });


    it("clicking first dot shows first slide", () => {
      renderSlider({ array: mockArchetypes, slidesPerView: 1 });
      const slide2Button = screen.getByRole("button", { name: "Aller au slide 2" });
      act(() => {
        slide2Button.click();
      });
      act(() => {
        vi.advanceTimersByTime(900);
      });
      expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();

      const slide1Button = screen.getByRole("button", { name: "Aller au slide 1" });
      act(() => {
        slide1Button.click();
      });
      act(() => {
        vi.advanceTimersByTime(900);
      });
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    });
  });
});
