import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { TWITCH_URL, DISCORD_URL } from "@/utils/const/extraLink";

describe("Footer", () => {
  describe("rendering", () => {
    it("renders the legal notice about Yu-Gi-Oh! and Konami", () => {
      render(<Footer />);
      expect(
        screen.getByText(/Les informations textuelles et graphiques présentées sur ce site concernant Yu-Gi-Oh!/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/4K Media Inc./i)).toBeInTheDocument();
      expect(screen.getByText(/Konami Digital Entertainment/i)).toBeInTheDocument();
    });

    it("renders the copyright with Archetype Battle", () => {
      render(<Footer />);
      expect(screen.getByText(/Archetype Battle/)).toBeInTheDocument();
      expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it("renders the passion tagline", () => {
      render(<Footer />);
      expect(
        screen.getByText("Conçu avec passion pour les duellistes")
      ).toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("link Twitch points to Twitch URL", () => {
      render(<Footer />);
      const twitchLink = screen.getByRole("link", { name: /Twitch/i });
      expect(twitchLink).toBeInTheDocument();
      expect(twitchLink).toHaveAttribute("href", TWITCH_URL);
      expect(twitchLink).toHaveAttribute("target", "_blank");
      expect(twitchLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("link Discord points to Discord URL", () => {
      render(<Footer />);
      const discordLink = screen.getByRole("link", { name: /Discord/i });
      expect(discordLink).toBeInTheDocument();
      expect(discordLink).toHaveAttribute("href", DISCORD_URL);
      expect(discordLink).toHaveAttribute("target", "_blank");
      expect(discordLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
