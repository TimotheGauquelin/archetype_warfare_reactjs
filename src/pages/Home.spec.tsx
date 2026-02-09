import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import userReducer from "../redux/slice/userSlice";
import Home from "./Home";
import type { Archetype } from "../types";
import { URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES, URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES, URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES } from "../constant/urlsBack";

function createTestStore() {
  return configureStore({
    reducer: { user: userReducer },
  });
}

const mockFamous: Archetype[] = [
  { id: 1, name: "Famous One", card_img_url: "https://example.com/f1.jpg" },
];
const mockRecent: Archetype[] = [
  { id: 2, name: "Recent One", card_img_url: "https://example.com/r1.jpg", in_aw_date: "2025-01-15T00:00:00.000Z" },
];
const mockHighlighted: Archetype[] = [
  {
    id: 3,
    name: "Slider Hero",
    slider_info: "Info slider",
    slider_img_url: "https://example.com/s1.jpg",
    is_highlighted: true,
  },
];

const API_BASE_URL = "http://localhost:8889/api";

let server: ReturnType<typeof setupServer>;

function renderHome() {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    </Provider>
  );
}

describe("Home (integration)", () => {
  beforeAll(() => {
    server = setupServer();
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    server.resetHandlers(
      http.get(`${API_BASE_URL}${URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES}`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100000)); // Délai très long
        return HttpResponse.json([]);
      }),
      http.get(`${API_BASE_URL}${URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES}`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100000)); // Délai très long
        return HttpResponse.json([]);
      }),
      http.get(`${API_BASE_URL}${URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES}`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100000)); // Délai très long
        return HttpResponse.json([]);
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    server.resetHandlers();
  });

  describe("on loading", () => {
    it("renders skeleton and welcome slide until APIs respond", () => {
      renderHome();

      expect(screen.getByText("Archétypes Populaires")).toBeInTheDocument();
      expect(screen.getByText("Nouveaux Archétypes")).toBeInTheDocument();
      const welcomeOrLoading = screen.getAllByText(/Bienvenue sur|Chargement des données/);
      expect(welcomeOrLoading.length).toBeGreaterThan(0);
    });
  });

  describe("quand les APIs répondent", () => {
    it("affiche les deux listes et le slider avec les données reçues", async () => {
      vi.useRealTimers();
      server.use(
        http.get(`${API_BASE_URL}/archetypes/getEightMostFamousArchetypes`, () => {
          return HttpResponse.json(mockFamous);
        }),
        http.get(`${API_BASE_URL}/archetypes/getEightMostRecentArchetypes`, () => {
          return HttpResponse.json(mockRecent);
        }),
        http.get(`${API_BASE_URL}/archetypes/getFiveRandomHighlightedArchetypes`, () => {
          return HttpResponse.json(mockHighlighted);
        })
      );

      renderHome();

      await waitFor(() => {
        expect(screen.getByText("Famous One")).toBeInTheDocument();
      });
      expect(screen.getByText("Recent One")).toBeInTheDocument();
      expect(screen.getByText("Slider Hero")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("does not crash if one API fails and exits loading state", async () => {
      vi.useRealTimers();
      server.use(
        http.get(`${API_BASE_URL}/archetypes/getEightMostFamousArchetypes`, () => {
          return HttpResponse.error();
        }),
        http.get(`${API_BASE_URL}/archetypes/getEightMostRecentArchetypes`, () => {
          return HttpResponse.json(mockRecent);
        }),
        http.get(`${API_BASE_URL}/archetypes/getFiveRandomHighlightedArchetypes`, () => {
          return HttpResponse.json([]);
        })
      );

      renderHome();

      await waitFor(
        () => {
          expect(screen.getByText("Recent One")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
      expect(screen.getByText("Nouveaux Archétypes")).toBeInTheDocument();
    });
  });

  describe("slider sans archétypes mis en avant", () => {
    it("affiche le slide de bienvenue quand aucun archétype pour le slider", async () => {
      vi.useRealTimers();
      server.use(
        http.get(`${API_BASE_URL}/archetypes/getEightMostFamousArchetypes`, () => {
          return HttpResponse.json(mockFamous);
        }),
        http.get(`${API_BASE_URL}/archetypes/getEightMostRecentArchetypes`, () => {
          return HttpResponse.json(mockRecent);
        }),
        http.get(`${API_BASE_URL}/archetypes/getFiveRandomHighlightedArchetypes`, () => {
          return HttpResponse.json([]);
        })
      );

      renderHome();

      await waitFor(
        () => {
          expect(screen.queryByText("Slider Hero")).not.toBeInTheDocument();
          expect(screen.getByText("Faites des duels avec vos cartes préférées !")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
