import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import PasswordResetPage from "./PasswordResetPage";
import {
  URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN,
  URL_BACK_UPDATE_PASSWORD,
} from "../../../constant/urlsBack";
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

const mockUser = { id: 1, username: "test", email: "test@example.com", roles: [], token: null, isAuthenticated: false };

function renderPasswordResetPage(resetToken = "fake-token-123") {
  return render(
    <MemoryRouter initialEntries={[`/password-reset/${resetToken}`]}>
      <Routes>
        <Route path="/password-reset/:resetToken" element={<PasswordResetPage />} />
      </Routes>
    </MemoryRouter>
  );
}

let server: ReturnType<typeof setupServer>;

describe("PasswordResetPage (integration)", () => {
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
      http.get(
        `${API_BASE_URL}${URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN("fake-token-123")}`,
        () => HttpResponse.json(mockUser)
      ),
      http.put(`${API_BASE_URL}${URL_BACK_UPDATE_PASSWORD(1)}`, () => new HttpResponse(null, { status: 200 }))
    );
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("display a loading state then an error message if the token is invalid", async () => {
      server.use(
        http.get(
          `${API_BASE_URL}${URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN("bad-token")}`,
          () => HttpResponse.json({ message: "Token invalide" }, { status: 404 })
        )
      );
      renderPasswordResetPage("bad-token");

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      await waitFor(
        () => {
          expect(screen.getByText(/lien de réinitialisation.*invalide|Token invalide/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("form validation", () => {
    it("display an error if the passwords are not identical", async () => {
      renderPasswordResetPage();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
      });

      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      const form = passwordInput.closest("form");
      if (!form) throw new Error("Form not found");

      await userEvent.type(passwordInput, "password123");
      await userEvent.type(confirmInput, "different");
      await act(async () => {
        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 0));
      });

      await waitFor(
        () => {
          expect(screen.getByText(/Les mots de passe ne sont pas identiques/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("display an error if a field is empty", async () => {
      renderPasswordResetPage();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
      });

      const form = screen.getByRole("button", { name: /Valider/i }).closest("form");
      if (!form) throw new Error("Form not found");
      await act(async () => {
        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 0));
      });

      await waitFor(
        () => {
          expect(screen.getByText(/Veuillez remplir les deux champs/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("updating the password", () => {
    it("redirect to the login page after success", async () => {
      renderPasswordResetPage();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
      });

      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /Valider/i });

      await userEvent.type(passwordInput, "newPassword123");
      await userEvent.type(confirmInput, "newPassword123");
      await act(async () => {
        await userEvent.click(submitButton);
        await new Promise((r) => setTimeout(r, 300));
      });

      await waitFor(
        () => {
          expect(navigateMock).toHaveBeenCalledWith(URL_FRONT_LOGIN);
        },
        { timeout: 5000 }
      );
    });

    it("display the error returned by the API in case of failure", async () => {
      const apiErrorMessage = "Le mot de passe ne respecte pas les critères.";
      server.use(
        http.put(`${API_BASE_URL}${URL_BACK_UPDATE_PASSWORD(1)}`, () => {
          return HttpResponse.json({ message: apiErrorMessage }, { status: 400 });
        })
      );
      renderPasswordResetPage();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
      });

      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /Valider/i });

      await userEvent.type(passwordInput, "short");
      await userEvent.type(confirmInput, "short");
      await act(async () => {
        await userEvent.click(submitButton);
        await new Promise((r) => setTimeout(r, 300));
      });

      await waitFor(
        () => {
          expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();
        },
        { timeout: 4000 }
      );
    });
  });
});
