import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import userReducer from "../../../../redux/slice/userSlice";
import MyDecksPage from "./MyDecksPage";
import { URL_BACK_GET_ALL_MY_DECKS } from "../../../../constant/urlsBack";
import { getMyDeckUpdatePath } from "../../../../constant/urlsFront";
import type { Deck } from "../../../../types";

vi.mock("../../layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="user-profil-layout">{children}</div>,
}));

const API_BASE_URL = "http://localhost:8889/api";

const mockUser = {
  isAuthenticated: true,
  id: 1,
  username: "testuser",
  email: "test@example.com",
  roles: ["USER"],
  token: "fake-token",
};

function createTestStore() {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: mockUser },
  });
}

function renderMyDecksPage() {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MyDecksPage />
      </MemoryRouter>
    </Provider>
  );
}

let server: ReturnType<typeof setupServer>;

describe("MyDecksPage (integration)", () => {
  beforeAll(() => {
    server = setupServer();
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    server.resetHandlers(
      http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_MY_DECKS(1)}`, () => {
        return HttpResponse.json([]);
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Tous mes decks'", async () => {
      renderMyDecksPage();
      await waitFor(() => {
        expect(screen.getByTestId("user-profile-layout-title")).toHaveTextContent("Tous mes decks:");
      });
    });

    it("display the 'Ajouter un deck' button", async () => {
      renderMyDecksPage();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Créer un deck/i })).toBeInTheDocument();
      });
    });
  });

  describe("list of decks", () => {
    it("display a message when there are no decks", async () => {
      renderMyDecksPage();
      await waitFor(
        () => {
          expect(screen.getByTestId("no-item-message")).toBeInTheDocument();
          expect(screen.getByTestId("no-item-message-text")).toHaveTextContent("Vous n'avez aucun deck pour le moment.");
        },
        { timeout: 2000 }
      );
    });

    it("display the decks returned by the API with links to the update", async () => {
      const mockDecks: Deck[] = [
        { id: 1, label: "Deck Dragon" },
        { id: 2, label: "Deck Magician" },
      ];
      server.use(
        http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_MY_DECKS(1)}`, () => {
          return HttpResponse.json(mockDecks);
        })
      );
      renderMyDecksPage();

      await waitFor(
        () => {
          expect(screen.getByText("Deck Dragon")).toBeInTheDocument();
          expect(screen.getByText("Deck Magician")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const link1 = screen.getByRole("link", { name: /Deck Dragon/i });
      const link2 = screen.getByRole("link", { name: /Deck Magician/i });
      expect(link1).toHaveAttribute("href", getMyDeckUpdatePath(1));
      expect(link2).toHaveAttribute("href", getMyDeckUpdatePath(2));
    });
  });
});
