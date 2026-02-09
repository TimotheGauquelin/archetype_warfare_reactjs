import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import BanlistPage from "./BanlistPage";
import type { Banlist, BanlistCard } from "../../../types";
import { URL_BACK_GET_CURRENT_BANLIST, URL_BACK_GET_ALL_CARD_TYPES } from "../../../constant/urlsBack";
import userReducer from "../../../redux/slice/userSlice";
import cardTypeReducer from "../../../redux/slice/cardTypeSlice";

vi.mock("../layout", () => ({
  default: ({ children, mainTitle, subTitle }: { children: React.ReactNode; mainTitle: string; subTitle: string }) => (
    <div data-testid="user-hero-layout">
      <h1>{mainTitle}</h1>
      <p>{subTitle}</p>
      {children}
    </div>
  ),
}));

vi.mock("../../../components/generic/header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../../../components/generic/footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

const API_BASE_URL = "http://localhost:8889/api";

const mockCardTypes = [
  { id: 1, label: "Monster", num_order: 1 },
  { id: 2, label: "Spell", num_order: 2 },
  { id: 3, label: "Trap", num_order: 3 },
];

const mockBanlistCards: BanlistCard[] = [
  {
    id: 1,
    card: {
      id: 1,
      name: "Dark Magician",
      card_type: "Monster",
      atk: 2500,
      level: 7,
      img_url: "https://example.com/dm.jpg",
    },
    card_status: {
      id: 1,
      label: "Forbidden",
    },
  },
  {
    id: 2,
    card: {
      id: 2,
      name: "Blue-Eyes White Dragon",
      card_type: "Monster",
      atk: 3000,
      level: 8,
      img_url: "https://example.com/be.jpg",
    },
    card_status: {
      id: 2,
      label: "Limited",
    },
  },
  {
    id: 3,
    card: {
      id: 3,
      name: "Dark Hole",
      card_type: "Spell",
      img_url: "https://example.com/dh.jpg",
    },
    card_status: {
      id: 3,
      label: "Semi-Limited",
    },
  },
  {
    id: 4,
    card: {
      id: 4,
      name: "Pot of Greed",
      card_type: "Spell",
      img_url: "https://example.com/pog.jpg",
    },
    card_status: {
      id: 1,
      label: "Forbidden",
    },
  },
];

const mockBanlist: Banlist = {
  id: 1,
  name: "Current Banlist",
  label: "Banlist Actuelle",
  date: "2024-01-01",
  is_current: true,
  is_active: true,
  banlist_archetype_cards: mockBanlistCards,
};

function createTestStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      cardType: cardTypeReducer,
    },
    preloadedState: {
      cardType: {
        cardTypes: [],
        isLoading: false,
        error: null,
      },
    },
  });
}

function renderBanlistPage() {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <BanlistPage />
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
}

let server: ReturnType<typeof setupServer>;

describe("BanlistPage (integration)", () => {
  beforeAll(() => {
    server = setupServer();
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    server.resetHandlers(
      http.get(`${API_BASE_URL}${URL_BACK_GET_CURRENT_BANLIST}`, () => {
        return HttpResponse.json(mockBanlist);
      }),
      http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_CARD_TYPES}`, () => {
        return HttpResponse.json({ data: mockCardTypes });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the main title", async () => {
      renderBanlistPage();
      expect(screen.getByText(/Faîtes attention aux cartes interdites/i)).toBeInTheDocument();
    });

    it("display the subtitle", async () => {
      renderBanlistPage();
      await waitFor(() => {
        expect(screen.getByText(/Archetype Warfare propose une toute nouvelle banlist/i)).toBeInTheDocument();
      });
    });

    it("display the search bar", async () => {
      renderBanlistPage();
      const absoluteInput = screen.getByTestId("absolute-input");
      expect(absoluteInput).toBeInTheDocument();
      const searchInput = within(absoluteInput).getByPlaceholderText(/Quelle carte recherchez-vous/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("aria-label", "Rechercher une carte");
    });

    it("display the cards sections", async () => {
      renderBanlistPage();
      expect(screen.getByText(/Cartes Interdites/i)).toBeInTheDocument();
      expect(screen.getByText(/Cartes Limitées/i)).toBeInTheDocument();
      expect(screen.getByText(/Cartes Semi-Limitées/i)).toBeInTheDocument();
    });
  });

  describe("loading data", () => {
    it("load the banlist from the API", async () => {
      let requestCalled = false;
      server.use(
        http.get(`${API_BASE_URL}${URL_BACK_GET_CURRENT_BANLIST}`, () => {
          requestCalled = true;
          return HttpResponse.json(mockBanlist);
        })
      );

      renderBanlistPage();
      await waitFor(
        () => {
          expect(requestCalled).toBe(true);
        },
        { timeout: 3000 }
      );
    });

    it("load the card types from the API", async () => {
      let requestCalled = false;
      server.use(
        http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_CARD_TYPES}`, () => {
          requestCalled = true;
          return HttpResponse.json({ data: mockCardTypes });
        })
      );

      renderBanlistPage();
      await waitFor(
        () => {
          expect(requestCalled).toBe(true);
        },
        { timeout: 3000 }
      );
    });
  });

  describe("search filtering", () => {
    it("filter the cards by name when typing", async () => {
      renderBanlistPage();
      // Attendre que les cartes soient chargées AVANT de tester le filtrage
      await waitFor(
        () => {
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
          expect(screen.getByAltText("Blue-Eyes White Dragon")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const searchInput = screen.getByPlaceholderText(/Quelle carte recherchez-vous/i);
      await userEvent.type(searchInput, "Dark Magician");

      // Attendre le debounce (300ms) + un peu de marge pour le filtrage
      await waitFor(
        () => {
          const images = screen.getAllByAltText("Dark Magician");
          expect(images.length).toBeGreaterThan(0);
          // Vérifier que Blue-Eyes n'est plus visible (filtré)
          expect(screen.queryByAltText("Blue-Eyes White Dragon")).not.toBeInTheDocument();
        },
        { timeout: 1000 } // 300ms debounce + marge
      );
    });

    it("do not filter the cards if the search is empty", async () => {
      renderBanlistPage();
      await waitFor(
        () => {
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const searchInput = screen.getByPlaceholderText(/Quelle carte recherchez-vous/i);
      expect(searchInput).toHaveValue("");

      // Toutes les cartes devraient être visibles
      await waitFor(
        () => {
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
          expect(screen.getByAltText("Blue-Eyes White Dragon")).toBeInTheDocument();
          expect(screen.getByAltText("Dark Hole")).toBeInTheDocument();
          expect(screen.getByAltText("Pot of Greed")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("filter the cards by name in a case insensitive way", async () => {
      renderBanlistPage();
      await waitFor(
        () => {
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
          expect(screen.getByAltText("Blue-Eyes White Dragon")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const searchInput = screen.getByPlaceholderText(/Quelle carte recherchez-vous/i);
      await userEvent.type(searchInput, "dark magician");

      await waitFor(
        () => {
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
          expect(screen.queryByAltText("Blue-Eyes White Dragon")).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("sorting cards by status", () => {
    it("display the forbidden cards in the appropriate section", async () => {
      renderBanlistPage();
      await waitFor(
        () => {
          expect(screen.getByText(/Cartes Interdites/i)).toBeInTheDocument();
          expect(screen.getByAltText("Dark Magician")).toBeInTheDocument();
          expect(screen.getByAltText("Pot of Greed")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
