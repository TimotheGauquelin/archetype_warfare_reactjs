import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import PasswordLostPage from "./PasswordLostPage";
import { URL_BACK_REQUEST_NEW_PASSWORD } from "../../../constant/urlsBack";
import { URL_FRONT_LOGIN } from "../../../constant/urlsFront";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const API_BASE_URL = "http://localhost:8889/api";

function renderPasswordLostPage() {
  return render(
    <MemoryRouter>
      <PasswordLostPage />
    </MemoryRouter>
  );
}

let server: ReturnType<typeof setupServer>;

describe("PasswordLostPage (integration)", () => {
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
      http.post(`${API_BASE_URL}${URL_BACK_REQUEST_NEW_PASSWORD}`, () => {
        return new HttpResponse(null, { status: 200 });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display the title 'Mot de passe oublié'", () => {
      renderPasswordLostPage();
      expect(screen.getByRole("heading", { name: /Mot de passe oublié/i })).toBeInTheDocument();
    });

    it("display the email field and the 'Envoyer le lien' button", () => {
      renderPasswordLostPage();
      expect(screen.getByText(/^Email\s*:/)).toBeInTheDocument();
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
      expect(screen.getByTestId("on-loading-button")).toBeInTheDocument();
    });
  });

  describe("sending the link", () => {
    it("display the success screen after successful sending", async () => {
      renderPasswordLostPage();
      const emailInput = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: /Envoyer le lien/i });

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.click(submitButton);

      await waitFor(
        () => {
          expect(screen.getByRole("heading", { name: /Email envoyé/i })).toBeInTheDocument();
          expect(
            screen.getByText(/Un e-mail vient de vous être envoyé/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("display the 'Revenir à la page de connexion' button after success", async () => {
      renderPasswordLostPage();
      const emailInput = screen.getByTestId("text-input");
      const submitButton = screen.getByRole("button", { name: /Envoyer le lien/i });

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.click(submitButton);

      await waitFor(
        () => {
          expect(
            screen.getByRole("button", { name: /Revenir à la page de connexion/i })
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("navigation", () => {
    it("navigate to the login page after clicking the 'Revenir à la page de connexion' button", async () => {
      renderPasswordLostPage();
      const emailInput = screen.getByTestId("text-input");
      const submitButton = screen.getByRole("button", { name: /Envoyer le lien/i });

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.click(submitButton);

      await waitFor(
        () => {
          expect(
            screen.getByRole("button", { name: /Revenir à la page de connexion/i })
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      await userEvent.click(screen.getByRole("button", { name: /Revenir à la page de connexion/i }));
      expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_LOGIN);
    });
  });
});
