import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import RegisterPage from "./RegisterPage";
import { URL_BACK_REGISTER } from "../../../constant/urlsBack";
import { URL_FRONT_LOGIN, URL_FRONT_TERMS_AND_CONDITIONS } from "../../../constant/urlsFront";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const API_BASE_URL = "http://localhost:8889/api";

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );
}

let server: ReturnType<typeof setupServer>;

describe("RegisterPage (integration)", () => {
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
      http.post(`${API_BASE_URL}${URL_BACK_REGISTER}`, () => {
        return new HttpResponse(null, { status: 201 });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Créer mon compte'", () => {
      renderRegisterPage();
      expect(screen.getByRole("heading", { name: /Créer mon compte/i })).toBeInTheDocument();
    });

    it("display the username, email, password and confirmation fields", () => {
      renderRegisterPage();
      expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByText(/^Email\s*:/)).toBeInTheDocument();
      expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="confirmPassword"]')).toBeInTheDocument();
    });

    it("display the terms and conditions checkbox", () => {
      renderRegisterPage();
      expect(screen.getByTestId("checkbox-input")).toBeInTheDocument();
      expect(screen.getByText(/termes et conditions/i)).toBeInTheDocument();
    });

    it("display the 'Créer mon compte' button", () => {
      renderRegisterPage();
      expect(screen.getByRole("button", { name: /Créer mon compte/i })).toBeInTheDocument();
    });

    it("display the 'Se connecter' link", () => {
      renderRegisterPage();
      expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("display an error if the passwords do not match", async () => {
      renderRegisterPage();
      const textboxes = screen.getAllByRole("textbox");
      const usernameInput = textboxes[0];
      const emailInput = textboxes[1];
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      const checkbox = screen.getByTestId("checkbox-input");
      const submitButton = screen.getByRole("button", { name: /Créer mon compte/i });

      await userEvent.type(usernameInput, "newuser");
      await userEvent.type(emailInput, "new@example.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.type(confirmInput, "different");
      await userEvent.click(checkbox);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
      });
    });

    it("display an error if the terms and conditions are not accepted", async () => {
      renderRegisterPage();
      const textboxes = screen.getAllByRole("textbox");
      await userEvent.type(textboxes[0], "newuser");
      await userEvent.type(textboxes[1], "new@example.com");
      await userEvent.type(document.querySelector('input[name="password"]') as HTMLInputElement, "password123");
      await userEvent.type(document.querySelector('input[name="confirmPassword"]') as HTMLInputElement, "password123");
      await userEvent.click(screen.getByRole("button", { name: /Créer mon compte/i }));

      await waitFor(() => {
        expect(screen.getByText(/Veuillez accepter les termes et conditions/i)).toBeInTheDocument();
      });
    });
  });

  describe("register", () => {
    it("redirect to the login page after success", async () => {
      renderRegisterPage();
      const textboxes = screen.getAllByRole("textbox");
      await userEvent.type(textboxes[0], "newuser");
      await userEvent.type(textboxes[1], "new@example.com");
      await userEvent.type(document.querySelector('input[name="password"]') as HTMLInputElement, "password123");
      await userEvent.type(document.querySelector('input[name="confirmPassword"]') as HTMLInputElement, "password123");
      await userEvent.click(screen.getByTestId("checkbox-input"));
      await userEvent.click(screen.getByRole("button", { name: /Créer mon compte/i }));

      await waitFor(
        () => {
          expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_LOGIN);
        },
        { timeout: 3000 }
      );
    });

    it("display the error returned by the API in case of failure", async () => {
      const apiErrorMessage = "Cet email est déjà utilisé.";
      server.use(
        http.post(`${API_BASE_URL}${URL_BACK_REGISTER}`, () => {
          return HttpResponse.json({ message: apiErrorMessage }, { status: 400 });
        })
      );
      renderRegisterPage();
      const textboxes = screen.getAllByRole("textbox");
      await userEvent.type(textboxes[0], "newuser");
      await userEvent.type(textboxes[1], "taken@example.com");
      await userEvent.type(document.querySelector('input[name="password"]') as HTMLInputElement, "password123");
      await userEvent.type(document.querySelector('input[name="confirmPassword"]') as HTMLInputElement, "password123");
      await userEvent.click(screen.getByTestId("checkbox-input"));
      await userEvent.click(screen.getByRole("button", { name: /Créer mon compte/i }));

      await waitFor(
        () => {
          expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();
        },
        { timeout: 4000 }
      );

      expect(screen.getByRole("button", { name: /Créer mon compte/i })).not.toBeDisabled();
    });
  });

  describe("navigation", () => {
    it("navigate to the login page after clicking on 'Se connecter'", async () => {
      renderRegisterPage();
      await userEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
      expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_LOGIN);
    });

    it("navigate to the terms and conditions page after clicking on the 'termes et conditions' link", async () => {
      renderRegisterPage();
      await userEvent.click(screen.getByRole("button", { name: /termes et conditions/i }));
      expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_TERMS_AND_CONDITIONS);
    });
  });
});
