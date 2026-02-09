import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ArchetypeCard from "./ArchetypeCard";
import type { Archetype } from "../../types";

const baseArchetype: Archetype = {
  id: 1,
  name: "Dark Magician",
  card_img_url: "https://example.com/dark-magician.jpg",
};

describe("ArchetypeCard", () => {
  describe("rendering", () => {
    it("renders archetype name", () => {
      render(<ArchetypeCard archetype={baseArchetype} index={0} />);
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    });

    it("renders image with card_img_url when provided", () => {
      render(<ArchetypeCard archetype={baseArchetype} index={0} />);
      const img = screen.getByRole("img", { name: "" });
      expect(img).toHaveAttribute("src", baseArchetype.card_img_url);
    });

    it("renders fallback image when card_img_url is missing", () => {
      const archetypeWithoutImg: Archetype = { ...baseArchetype, card_img_url: undefined };
      render(<ArchetypeCard archetype={archetypeWithoutImg} index={0} />);
      const img = screen.getByRole("img", { name: "" });
      expect(img).toHaveAttribute("src", expect.stringContaining("waiting_archetype_image"));
    });
  });

  describe("medal", () => {
    it("does not show medal when haveAMedal is false", () => {
      render(<ArchetypeCard archetype={baseArchetype} index={0} haveAMedal={false} />);
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(1);
    });

    it("does not show medal for index >= 3 when haveAMedal is true", () => {
      render(<ArchetypeCard archetype={baseArchetype} index={3} haveAMedal />);
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(1);
    });
  });

  describe("displayDate", () => {
    it("shows date when displayDate is true and in_aw_date is set", () => {
      const archetypeWithDate: Archetype = {
        ...baseArchetype,
        in_aw_date: "2025-01-15T00:00:00.000Z",
      };
      render(<ArchetypeCard archetype={archetypeWithDate} index={0} displayDate />);
      expect(screen.getByText(/15\/01\/2025/)).toBeInTheDocument();
    });

    it("does not show date when displayDate is false", () => {
      const archetypeWithDate: Archetype = {
        ...baseArchetype,
        in_aw_date: "2025-01-15T00:00:00.000Z",
      };
      render(<ArchetypeCard archetype={archetypeWithDate} index={0} displayDate={false} />);
      expect(screen.queryByText(/15\/01\/2025/)).not.toBeInTheDocument();
    });
  });
});
