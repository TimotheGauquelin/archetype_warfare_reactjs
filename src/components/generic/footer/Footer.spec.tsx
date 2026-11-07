import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";
import { TWITCH_URL, DISCORD_URL } from "@/utils/const/extraLink";
import { URL_FRONT_CGU } from "@/constant/urlsFront";

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe("Footer", () => {
  describe("rendering", () => {
    it("renders the legal notice about Yu-Gi-Oh! and Konami", () => {
      renderFooter();
      expect(
        screen.getByText(/Les informations textuelles et graphiques présentées sur ce site concernant Yu-Gi-Oh!/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/4K Media Inc./i)).toBeInTheDocument();
      expect(screen.getByText(/Konami Digital Entertainment/i)).toBeInTheDocument();
    });

    it("renders the copyright with Archetype Battle", () => {
      renderFooter();
      expect(screen.getByText(/Archetype Battle/)).toBeInTheDocument();
      expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it("renders the passion tagline", () => {
      renderFooter();
      expect(
        screen.getByText("Conçu avec passion pour les duellistes")
      ).toBeInTheDocument();
    });

    it("renders a link to the CGU page", () => {
      renderFooter();
      const cguLink = screen.getByRole("link", {
        name: /Mentions légales \/ CGU/i,
      });
      expect(cguLink).toHaveAttribute("href", URL_FRONT_CGU);
    });
  });

  describe("social links", () => {
    it("link Twitch points to Twitch URL", () => {
      renderFooter();
      const twitchLink = screen.getByRole("link", { name: /Twitch/i });
      expect(twitchLink).toBeInTheDocument();
      expect(twitchLink).toHaveAttribute("href", TWITCH_URL);
      expect(twitchLink).toHaveAttribute("target", "_blank");
      expect(twitchLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("link Discord points to Discord URL", () => {
      renderFooter();
      const discordLink = screen.getByRole("link", { name: /Discord/i });
      expect(discordLink).toBeInTheDocument();
      expect(discordLink).toHaveAttribute("href", DISCORD_URL);
      expect(discordLink).toHaveAttribute("target", "_blank");
      expect(discordLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
