import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TestingLibraryMatchers } from "testing-library__jest-dom/matchers";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "./Header";
import userReducer from "../../../redux/slice/userSlice";
import localeReducer from "../../../redux/slice/localeSlice";
import type { User } from "../../../types";
import {
  URL_FRONT_HOME,
  URL_FRONT_ABOUT,
  URL_FRONT_ARCHETYPES,
  URL_FRONT_BANLIST,
  URL_FRONT_ROAD_MAP,
  URL_FRONT_TOURNAMENTS,
  URL_FRONT_LOGIN,
  URL_FRONT_MY_PROFILE,
} from "../../../constant/urlsFront";
import userEvent from "@testing-library/user-event";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {}
}

function createTestStore(preloadedState?: { user?: User }) {
  return configureStore({
    reducer: { user: userReducer, locale: localeReducer },
    preloadedState: preloadedState as { user?: User } | undefined,
  });
}

function renderHeader(
  options: {
    initialRoute?: string;
    user?: { isAuthenticated: boolean; username?: string | null };
  } = {}
) {
  const { initialRoute = "/", user } = options;
  const store = createTestStore(
    user !== undefined
      ? {
          user: {
            isAuthenticated: user.isAuthenticated,
            username: user.username ?? null,
            id: null,
            email: null,
            roles: [],
            token: null,
          } as User,
        }
      : undefined
  );

  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[initialRoute]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Header />
      </MemoryRouter>
    </Provider>
  );
}

describe("Header", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("rendering", () => {
    it("renders the logo link to home", () => {
      renderHeader();
      const homeLink = screen
        .getAllByRole("link")
        .find((el) => el.getAttribute("href") === URL_FRONT_HOME);
      expect(homeLink).toBeDefined();
      expect(homeLink!).toBeInTheDocument();
    });

    it("renders navigation links: Concept, Archetypes, Banlist, Tournaments, RoadMap", () => {
      renderHeader();
      expect(screen.getByRole("link", { name: /Concept/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Archetypes/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Banlist/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Tournois/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /RoadMap/i })).toBeInTheDocument();
    });

    it("links have correct hrefs", () => {
      renderHeader();
      expect(screen.getByRole("link", { name: /Concept/i })).toHaveAttribute("href", URL_FRONT_ABOUT);
      expect(screen.getByRole("link", { name: /Archetypes/i })).toHaveAttribute("href", URL_FRONT_ARCHETYPES);
      expect(screen.getByRole("link", { name: /Banlist/i })).toHaveAttribute("href", URL_FRONT_BANLIST);
      expect(screen.getByRole("link", { name: /Tournois/i })).toHaveAttribute("href", URL_FRONT_TOURNAMENTS);
      expect(screen.getByRole("link", { name: /RoadMap/i })).toHaveAttribute("href", URL_FRONT_ROAD_MAP);
    });

    it("renders the language select", () => {
      renderHeader();
      const languageSelects = screen.getAllByLabelText(/Langue/i);
      expect(languageSelects.length).toBeGreaterThanOrEqual(1);
      expect(languageSelects[0]).toBeInTheDocument();
    });
  });

  describe("user state", () => {
    it("shows Connexion and links to login when user is not authenticated", () => {
      renderHeader({ user: { isAuthenticated: false } });
      const connexionLink = screen.getByRole("link", { name: /Connexion/i });
      expect(connexionLink).toBeInTheDocument();
      expect(connexionLink).toHaveAttribute("href", URL_FRONT_LOGIN);
    });

    it("shows username and links to profile when user is authenticated", () => {
      renderHeader({ user: { isAuthenticated: true, username: "john_doe" } });
      const profileLink = screen.getByRole("link", { name: /john_doe/i });
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute("href", URL_FRONT_MY_PROFILE);
    });
  });

  describe("active route styling", () => {
    it("applies active class to nav link when route matches", () => {
      renderHeader({ initialRoute: URL_FRONT_ABOUT });
      const conceptLink = screen.getByRole("link", { name: /Concept/i });
      expect(conceptLink).toHaveClass("text-red-400");
    });

    it("applies default class to nav link when route does not match", () => {
      renderHeader({ initialRoute: "/" });
      const conceptLink = screen.getByRole("link", { name: /Concept/i });
      expect(conceptLink).toHaveClass("text-gray-600");
    });
  });

  describe("mobile menu", () => {
    it("toggles mobile nav when hamburger is clicked", async () => {
      const { container } = renderHeader();

      const mobileBar = container.querySelector(".flex.items-center.gap-3.lscreen\\:hidden");
      expect(mobileBar).toBeTruthy();
      const hamburger = mobileBar?.querySelector("div:last-child");
      expect(hamburger).toBeTruthy();

      await act(async () => {
        await userEvent.click(hamburger as HTMLElement);
      });

      const conceptLinks = screen.getAllByRole("link", { name: /Concept/i });
      expect(conceptLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});
