import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import userReducer from "../../../../redux/slice/userSlice";
import MyProfilePage from "./MyProfilePage";
import { URL_BACK_DELETE_USER } from "../../../../constant/urlsBack";

vi.mock("../../layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="user-profil-layout">{children}</div>,
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const API_BASE_URL = "http://localhost:8889/api";

const mockUser = {
  isAuthenticated: true,
  id: 1,
  username: "testuser",
  email: "test@example.com",
  roles: ["USER"],
  token: "fake-token",
  belovedArchetype: null,
};

function createTestStore() {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: mockUser },
  });
}

function renderMyProfilePage() {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <MyProfilePage />
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
}

let server: ReturnType<typeof setupServer>;

describe("MyProfilePage (integration)", () => {
  beforeAll(() => {
    server = setupServer();
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    navigateMock.mockClear();
    server.resetHandlers(
      http.delete(`${API_BASE_URL}${URL_BACK_DELETE_USER(1)}`, () => {
        return new HttpResponse(null, { status: 200 });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Informations du compte'", () => {
      renderMyProfilePage();
      expect(screen.getByTestId("user-profile-layout-title")).toHaveTextContent("Informations du compte:");
    });

    it("display the username", () => {
      renderMyProfilePage();
      expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("display the user's roles", () => {
      renderMyProfilePage();
      expect(screen.getByText(/Rôle\(s\)/i)).toBeInTheDocument();
      expect(screen.getByText("USER")).toBeInTheDocument();
    });

    it("display the 'Modifier mes informations' button", () => {
      renderMyProfilePage();
      const button = screen.getByRole("button", { name: /Modifier mes informations/i });
      expect(button).toBeInTheDocument();
    });

    it("display the 'Supprimer mon compte' button", () => {
      renderMyProfilePage();
      const button = screen.getByRole("button", { name: /Supprimer mon compte/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("account deletion", () => {
    it("display the confirmation popup when clicking on 'Supprimer mon compte'", async () => {
      renderMyProfilePage();
      const deleteButton = screen.getByRole("button", { name: /Supprimer mon compte/i });
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(screen.getByRole("heading", { name: /Supprimer votre compte/i })).toBeInTheDocument();
          expect(screen.getByText(/Cette action est irréversible/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("close the popup when clicking on 'Annuler'", async () => {
      renderMyProfilePage();
      const deleteButton = screen.getByRole("button", { name: /Supprimer mon compte/i });
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(screen.getByRole("heading", { name: /Supprimer votre compte/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const cancelButton = screen.getByRole("button", { name: /Annuler/i });
      await userEvent.click(cancelButton);

      await waitFor(
        () => {
          expect(screen.queryByRole("heading", { name: /Supprimer votre compte/i })).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("call the DELETE API, disconnect the user and redirect to the home page when clicking on 'Confirmer'", async () => {
      let deleteRequestCalled = false;
      server.use(
        http.delete(`${API_BASE_URL}${URL_BACK_DELETE_USER(1)}`, () => {
          deleteRequestCalled = true;
          return new HttpResponse(null, { status: 200 });
        })
      );

      const { store } = renderMyProfilePage();
      const deleteButton = screen.getByRole("button", { name: /Supprimer mon compte/i });
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: /Confirmer/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const confirmButton = screen.getByRole("button", { name: /Confirmer/i });
      await userEvent.click(confirmButton);

      await waitFor(
        () => {
          expect(deleteRequestCalled).toBe(true);
          expect(navigateMock).toHaveBeenCalledWith("/");
          const state = store.getState();
          expect(state.user.isAuthenticated).toBe(false);
          expect(state.user.id).toBeNull();
          expect(state.user.username).toBeNull();
          expect(state.user.token).toBeNull();
        },
        { timeout: 3000 }
      );
    });
  });
});
