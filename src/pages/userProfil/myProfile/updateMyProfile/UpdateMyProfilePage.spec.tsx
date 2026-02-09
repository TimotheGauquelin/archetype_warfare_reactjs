import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import userReducer from "../../../../redux/slice/userSlice";
import UpdateMyProfilePage from "./UpdateMyProfilePage";

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

let server: ReturnType<typeof setupServer>;

describe("UpdateMyProfilePage (integration)", () => {
    beforeAll(() => {
        server = setupServer();
        server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(() => {
        navigateMock.mockClear();
    });

    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    describe("rendering", () => {
        it("display the title 'Modifier mon profil'", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByTestId("user-profile-layout-title")).toHaveTextContent("Modifier mon profil:");
        });

        it("display the 'Retour' button", async () => {
            renderUpdateMyProfilePage();
            expect(screen.getByText(/Retour/i)).toBeInTheDocument();
        });

        it("display the 'Username' field with the initial value", async () => {
            renderUpdateMyProfilePage();

            expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument();
            const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
            expect(usernameInput).toBeInTheDocument();
            expect(usernameInput.value).toBe("testuser");
            expect(usernameInput.disabled).toBe(true);
        });

        it("display the 'Email' field with the initial value", async () => {
            renderUpdateMyProfilePage();
                expect(screen.getByText(/^Email\s*:/)).toBeInTheDocument();
                const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                expect(emailInput).toBeInTheDocument();
                expect(emailInput.value).toBe("test@example.com");
                expect(emailInput.disabled).toBe(true);
        });
    });

});
