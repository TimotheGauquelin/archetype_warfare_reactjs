import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../../../redux/slice/userSlice";
import MyProfilePage from "./MyProfilePage";

vi.mock("../../layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="user-profil-layout">{children}</div>,
}));

const navigateMock = vi.fn();
const deleteUserMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../../services/user", () => ({
  getUserById: vi.fn(async (_id: string | number, setUser: (v: unknown) => void) => {
    setUser({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      roles: ["USER"],
      biography: null,
      country: null,
      loved_archetype_id: null,
      loved_archetype: null,
    });
  }),
  deleteUser: (...args: unknown[]) => deleteUserMock(...args),
}));

const mockUser = {
  isAuthenticated: true,
  id: 1,
  username: "testuser",
  email: "test@example.com",
  roles: ["USER"],
  token: "fake-token",
  biography: null,
  country: null,
  loved_archetype_id: null,
  loved_archetype: null,
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

describe("MyProfilePage (integration)", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    deleteUserMock.mockClear();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Informations du compte'", () => {
      renderMyProfilePage();
      expect(screen.getByTestId("user-profile-layout-title")).toHaveTextContent("Informations du compte");
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

    it("display the 'Modifier mon profil' button", () => {
      renderMyProfilePage();
      const button = screen.getByRole("button", { name: /Modifier mon profil/i });
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

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Supprimer votre compte/i })).toBeInTheDocument();
        expect(screen.getByText(/Cette action est irréversible/i)).toBeInTheDocument();
      });
    });

    it("close the popup when clicking on 'Annuler'", async () => {
      renderMyProfilePage();
      const deleteButton = screen.getByRole("button", { name: /Supprimer mon compte/i });
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Supprimer votre compte/i })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole("button", { name: /Annuler/i });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole("heading", { name: /Supprimer votre compte/i })).not.toBeInTheDocument();
      });
    });

    it("call deleteUser when clicking on 'Confirmer'", async () => {
      renderMyProfilePage();
      const deleteButton = screen.getByRole("button", { name: /Supprimer mon compte/i });
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Confirmer/i })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", { name: /Confirmer/i });
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(deleteUserMock).toHaveBeenCalled();
      });
    });
  });
});
