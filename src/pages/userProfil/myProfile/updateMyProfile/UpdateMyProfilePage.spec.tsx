import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../../../redux/slice/userSlice";
import UpdateMyProfilePage from "./UpdateMyProfilePage";

vi.mock("../../layout", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="user-profil-layout">{children}</div>,
}));

vi.mock("@/services/archetype", () => ({
    getArchetypesNames: vi.fn(async (setArchetypes: (v: unknown[]) => void) => {
        setArchetypes([{ id: 1, name: "Blue-Eyes" }]);
    }),
}));

vi.mock("@/services/user", async () => {
    const actual = await vi.importActual<typeof import("@/services/user")>("@/services/user");
    return {
        ...actual,
        getUserById: vi.fn(async (_id: string | number, setUser: (v: unknown) => void) => {
            setUser({
                id: 1,
                username: "testuser",
                email: "test@example.com",
                roles: ["USER"],
                biography: "",
                loved_archetype_id: null,
                loved_archetype: null,
            });
        }),
        updateMyProfile: vi.fn(),
        changeMyPassword: vi.fn(),
    };
});

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

const mockUser = {
    isAuthenticated: true,
    id: 1,
    username: "testuser",
    email: "test@example.com",
    roles: ["USER"],
    token: "fake-token",
    biography: null,
    loved_archetype_id: null,
    loved_archetype: null,
};

function createTestStore() {
    return configureStore({
        reducer: {
            user: userReducer,
        },
        preloadedState: {
            user: mockUser,
        },
    });
}

function renderUpdateMyProfilePage() {
    const store = createTestStore();
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <UpdateMyProfilePage />
            </MemoryRouter>
        </Provider>
    );
}

describe("UpdateMyProfilePage (integration)", () => {
    beforeEach(() => {
        navigateMock.mockClear();
        vi.clearAllMocks();
    });

    describe("rendering", () => {
        it("display the title 'Modifier mon profil'", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByTestId("user-profile-layout-title")).toHaveTextContent("Modifier mon profil");
        });

        it("display the 'Retour' button", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByText(/Retour/i)).toBeInTheDocument();
        });

        it("display the 'Username' field with the initial value", async () => {
            renderUpdateMyProfilePage();

            expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument();
            await waitFor(() => {
                const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
                expect(usernameInput).toBeInTheDocument();
                expect(usernameInput.value).toBe("testuser");
                expect(usernameInput.disabled).toBe(true);
            });
        });

        it("display the 'Email' field with the initial value", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByText(/^Email\s*:/)).toBeInTheDocument();
            await waitFor(() => {
                const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                expect(emailInput).toBeInTheDocument();
                expect(emailInput.value).toBe("test@example.com");
                expect(emailInput.disabled).toBe(true);
            });
        });

        it("display password section fields", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByRole("heading", { name: /^Mot de passe$/i })).toBeInTheDocument();
            expect(screen.getByLabelText(/Mot de passe actuel/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^Nouveau mot de passe/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirmation du nouveau mot de passe/i)).toBeInTheDocument();
        });
    });
});
