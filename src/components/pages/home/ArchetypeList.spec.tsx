import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArchetypeList from "./ArchetypeList";
import type { Archetype } from "../../../types";

const mockArchetypes: Archetype[] = [
  { id: 1, name: "Dark Magician", card_img_url: "https://example.com/1.jpg" },
  { id: 2, name: "Blue-Eyes", card_img_url: "https://example.com/2.jpg" },
];

function renderArchetypeList(props: Partial<React.ComponentProps<typeof ArchetypeList>> = {}) {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ArchetypeList
        dataArray={props.dataArray ?? []}
        subTitleDividerText={props.subTitleDividerText}
        haveMedal={props.haveMedal}
        isFetching={props.isFetching}
        skeletonItemCount={props.skeletonItemCount}
        errorMessage={props.errorMessage}
        displayDate={props.displayDate}
      />
    </MemoryRouter>
  );
}

describe("ArchetypeList", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when isFetching", () => {
    it("renders skeleton when isFetching is true", () => {
      renderArchetypeList({ dataArray: mockArchetypes, isFetching: true });
      expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
      expect(screen.queryByText("Aucun archétype trouvé")).not.toBeInTheDocument();
    });

    it("renders SubtitleDivider in skeleton when subTitleDividerText is provided", () => {
      renderArchetypeList({
        dataArray: mockArchetypes,
        isFetching: true,
        subTitleDividerText: "Archétypes Populaires",
      });
      expect(screen.getByText("Archétypes Populaires")).toBeInTheDocument();
    });
  });

  describe("when not fetching and empty", () => {
    it("renders NoItemMessage with default message when dataArray is empty", () => {
      renderArchetypeList({ dataArray: [] });
      expect(screen.getByText("Aucun archétype trouvé")).toBeInTheDocument();
    });

    it("renders NoItemMessage with errorMessage when provided and dataArray is empty", () => {
      renderArchetypeList({
        dataArray: [],
        errorMessage: "Erreur de chargement",
      });
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
    });
  });

  describe("when not fetching and has data", () => {
    it("renders SubtitleDivider when subTitleDividerText is provided", () => {
      renderArchetypeList({
        dataArray: mockArchetypes,
        subTitleDividerText: "Archétypes Populaires",
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("Archétypes Populaires")).toBeInTheDocument();
    });

    it("renders archetype names as links", () => {
      renderArchetypeList({ dataArray: mockArchetypes });
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
      expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
    });

    it("links point to correct archetype route", () => {
      renderArchetypeList({ dataArray: mockArchetypes });
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      const link1 = screen.getByRole("link", { name: /Dark Magician/i });
      expect(link1).toHaveAttribute("href", "/archetype/1");
      const link2 = screen.getByRole("link", { name: /Blue-Eyes/i });
      expect(link2).toHaveAttribute("href", "/archetype/2");
    });
  });
});
