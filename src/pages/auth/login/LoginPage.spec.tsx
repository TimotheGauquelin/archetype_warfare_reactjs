import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import userReducer from "../../../redux/slice/userSlice";
import LoginPage from "./LoginPage";
import { URL_BACK_LOGIN, URL_BACK_GET_CONFIG } from "../../../constant/urlsBack";
import { URL_FRONT_PASSWORD_LOST, URL_FRONT_REGISTER } from "../../../constant/urlsFront";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("jwt-decode", () => ({
  default: () => ({
    id: 1,
    username: "testuser",
    email: "user@example.com",
    roles: ["USER"],
  }),
}));

const API_BASE_URL = "http://localhost:8889/api";

function createTestStore() {
  return configureStore({
    reducer: { user: userReducer },
  });
}

function renderLoginPage() {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
}

let server: ReturnType<typeof setupServer>;

describe("LoginPage (integration)", () => {
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
      http.post(`${API_BASE_URL}${URL_BACK_LOGIN}`, () => {
        return HttpResponse.json({ token: "fake-jwt" });
      }),
      http.get(`${API_BASE_URL}${URL_BACK_GET_CONFIG}`, () => {
        return HttpResponse.json({ registration_enabled: true });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Connectez-vous'", () => {
      renderLoginPage();
      expect(screen.getByRole("heading", { name: /Connectez-vous/i })).toBeInTheDocument();
    });

    it("display the email and password fields", () => {
      renderLoginPage();
      expect(screen.getByText(/^Email\s*:/)).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
    });

    it("display the 'Se connecter' button", () => {
      renderLoginPage();
      expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
    });

    it("display the 'Mot de passe oublié' link", () => {
      renderLoginPage();
      expect(screen.getByRole("button", { name: /Mot de passe oublié/i })).toBeInTheDocument();
    });

    it("display the 'Créer un compte' link when registration_enabled is true", async () => {
      renderLoginPage();
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /Créer un compte/i })).toBeInTheDocument();
      });
    });

    it("do not display the 'Créer un compte' link when registration_enabled is false", async () => {
      server.use(
        http.get(`${API_BASE_URL}${URL_BACK_GET_CONFIG}`, () => {
          return HttpResponse.json({ registration_enabled: false });
        })
      );
      renderLoginPage();
      await waitFor(() => {
        expect(screen.queryByRole("link", { name: /Créer un compte/i })).not.toBeInTheDocument();
      });
    });
  });

  describe("form validation", () => {
    it("display an error if the email is invalid", async () => {
      renderLoginPage();
      const emailInput = screen.getByRole("textbox");
      const form = emailInput.closest("form");
      if (!form) throw new Error("Form not found");

      await userEvent.type(emailInput, "invalid");
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(screen.getByText(/Veuillez saisir une adresse email valide/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("display an error if the password is empty", async () => {
      renderLoginPage();
      const emailInput = screen.getByRole("textbox");
      const form = emailInput.closest("form");
      if (!form) throw new Error("Form not found");

      await userEvent.type(emailInput, "user@example.com");
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(screen.getByText(/Veuillez saisir votre mot de passe/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("log in", () => {
    it("send the credentials and redirect to the home page in case of success", async () => {
      renderLoginPage();
      const emailInput = screen.getByRole("textbox");
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /Se connecter/i });

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith("/");
      });
    });

    it("display the error returned by the API in case of failure", async () => {
      const apiErrorMessage = "Identifiants incorrects";
      server.use(
        http.post(`${API_BASE_URL}${URL_BACK_LOGIN}`, () => {
          return HttpResponse.json({ message: apiErrorMessage }, { status: 401 });
        })
      );
      renderLoginPage();
      const emailInput = screen.getByRole("textbox");
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /Se connecter/i });

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.type(passwordInput, "wrong");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe("navigation", () => {
    it("navigue vers la page mot de passe oublié au clic sur le bouton", async () => {
      renderLoginPage();
      await userEvent.click(screen.getByRole("button", { name: /Mot de passe oublié/i }));
      expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_PASSWORD_LOST);
    });

    it("le lien Créer un compte pointe vers l'URL d'inscription", async () => {
      renderLoginPage();
      await waitFor(() => {
        const link = screen.getByRole("link", { name: /Créer un compte/i });
        expect(link).toHaveAttribute("href", URL_FRONT_REGISTER);
      });
    });
  });
});
