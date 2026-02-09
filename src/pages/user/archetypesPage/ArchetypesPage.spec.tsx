import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import userReducer from "../../../redux/slice/userSlice";
import eraReducer from "../../../redux/slice/eraSlice";
import ArchetypesPage from "./ArchetypesPage";
import type { Archetype } from "../../../types";
import { URL_BACK_GET_ALL_ERAS } from "@/constant/urlsBack";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function createTestStore() {
  return configureStore({
    reducer: { user: userReducer, era: eraReducer },
  });
}

const mockArchetypes: Archetype[] = [
  { id: 1, name: "Dark Magician", card_img_url: "https://example.com/1.jpg", era_id: 1 },
  { id: 2, name: "Blue-Eyes", card_img_url: "https://example.com/2.jpg", era_id: 2 },
];

const mockEras = [
  { id: 1, label: "DM" },
  { id: 2, label: "GX" },
];

const API_BASE_URL = "http://localhost:8889/api";

let server: ReturnType<typeof setupServer>;

function renderArchetypesPage() {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ArchetypesPage />
      </MemoryRouter>
    </Provider>
  );
}

function getRandomButton(): HTMLButtonElement | undefined {
  const buttons = screen.getAllByRole("button");
  return buttons.find((btn) => {
    const hasSvg = btn.querySelector("svg") !== null;
    const hasRedBackground = btn.style.backgroundColor === "rgb(249, 87, 87)" || btn.style.backgroundColor === "#F95757";
    return hasSvg && hasRedBackground;
  }) as HTMLButtonElement | undefined;
}

describe("ArchetypesPage (integration)", () => {
  beforeAll(() => {
    server = setupServer();
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockClear();

    server.resetHandlers(
      http.get(`${API_BASE_URL}/archetypes/search`, () => {
        return HttpResponse.json({
          data: mockArchetypes,
          pagination: { total: 2, totalPages: 1, currentPage: 0, pageSize: 12 },
        });
      }),
      http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_ERAS}`, () => {
        return HttpResponse.json(mockEras);
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe("on loading", () => {
    it("renders skeleton until APIs respond", () => {
      server.use(
        http.get(`${API_BASE_URL}/archetypes/search`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100000));
          return HttpResponse.json({ data: [], pagination: { total: 0, totalPages: 0, currentPage: 0, pageSize: 12 } });
        }),
        http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_ERAS}`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100000));
          return HttpResponse.json([]);
        })
      );

      renderArchetypesPage();

      const skeletonElements = screen.getByTestId("archetype-list-skeleton");
      expect(skeletonElements).toBeInTheDocument();

      expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
      expect(screen.queryByText("Blue-Eyes")).not.toBeInTheDocument();
    });
  });

  describe("when APIs respond", () => {
    it("displays archetypes and era options", async () => {
      vi.useRealTimers();

      renderArchetypesPage();

      await waitFor(() => {
        expect(screen.getByText("Dark Magician")).toBeInTheDocument();
        expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
      });
      expect(screen.getByText("DM")).toBeInTheDocument();
      expect(screen.getByText("GX")).toBeInTheDocument();
    });
  });

  describe("search archetypes", () => {
    it("by name", async () => {
      vi.useRealTimers();

      server.use(
        http.get(`${API_BASE_URL}/archetypes/search`, ({ request }) => {
          const url = new URL(request.url);
          const nameParam = url.searchParams.get("name");

          if (nameParam) {
            const filteredArchetypes = mockArchetypes.filter((archetype) =>
              archetype.name.toLowerCase().includes(nameParam.toLowerCase())
            );
            return HttpResponse.json({
              data: filteredArchetypes,
              pagination: {
                total: filteredArchetypes.length,
                totalPages: 1,
                currentPage: 0,
                pageSize: 12,
              },
            });
          }

          return HttpResponse.json({
            data: mockArchetypes,
            pagination: { total: 2, totalPages: 1, currentPage: 0, pageSize: 12 },
          });
        })
      );

      renderArchetypesPage();

      await waitFor(() => {
        expect(screen.getByText("Dark Magician")).toBeInTheDocument();
        expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Quel archetype recherchez-vous ?") as HTMLInputElement;

      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Dark");


      await waitFor(
        () => {
          expect(screen.getByText("Dark Magician")).toBeInTheDocument();
          expect(screen.queryByText("Blue-Eyes")).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("by era", async () => {
      vi.useRealTimers();

      server.use(
        http.get(`${API_BASE_URL}/archetypes/search`, ({ request }) => {
          const url = new URL(request.url);
          const eraParam = url.searchParams.get("era");

          if (eraParam && eraParam !== "") {
            const filteredArchetypes = mockArchetypes.filter((archetype) => {
              const eraId = (archetype as Archetype & { era_id?: number }).era_id;
              return eraId !== undefined && String(eraId) === eraParam;
            });
            return HttpResponse.json({
              data: filteredArchetypes,
              pagination: {
                total: filteredArchetypes.length,
                totalPages: 1,
                currentPage: 0,
                pageSize: 12,
              },
            });
          }

          return HttpResponse.json({
            data: mockArchetypes,
            pagination: { total: 2, totalPages: 1, currentPage: 0, pageSize: 12 },
          });
        })
      );

      renderArchetypesPage();

      await waitFor(() => {
        expect(screen.getByText("Dark Magician")).toBeInTheDocument();
        expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
      });

      await waitFor(() => {
        const eraSelect = document.querySelector('select[name="era"]') as HTMLSelectElement;
        expect(eraSelect).toBeInTheDocument();
        const options = eraSelect.querySelectorAll('option');
        expect(options.length).toBeGreaterThan(1); // Plus que juste l'option par défaut
      });

      const eraSelect = document.querySelector('select[name="era"]') as HTMLSelectElement;
      
      await userEvent.selectOptions(eraSelect, "1");

      await waitFor(
        () => {
          expect(screen.getByText("Dark Magician")).toBeInTheDocument();
          expect(screen.queryByText("Blue-Eyes")).not.toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe("random button", () => {
    it("is disabled when there are 0 archétypes", async () => {
      vi.useRealTimers();

      server.use(
        http.get(`${API_BASE_URL}/archetypes/search`, () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, totalPages: 0, currentPage: 0, pageSize: 12 },
          });
        })
      );

      renderArchetypesPage();

      await waitFor(() => {
        const randomButton = getRandomButton();
        expect(randomButton).toBeDefined();
        expect(randomButton).toBeDisabled();
      });
    });

    it("is disabled when a name is entered", async () => {
      vi.useRealTimers();

      renderArchetypesPage();

      await waitFor(() => {
        expect(screen.getByText("Dark Magician")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Quel archetype recherchez-vous ?") as HTMLInputElement;
      
      await userEvent.type(searchInput, "D");

      await waitFor(() => {
        const randomButton = getRandomButton();
        expect(randomButton).toBeDefined();
        expect(randomButton).toBeDisabled();
      }, { timeout: 1000 });
    });

    it("is disabled when an era is selected", async () => {
      vi.useRealTimers();

      renderArchetypesPage();

      await waitFor(() => {
        expect(screen.getByText("Dark Magician")).toBeInTheDocument();
      });

      await waitFor(() => {
        const eraSelect = document.querySelector('select[name="era"]') as HTMLSelectElement;
        expect(eraSelect).toBeInTheDocument();
        const options = eraSelect.querySelectorAll('option');
        expect(options.length).toBeGreaterThan(1);
      });

      const eraSelect = document.querySelector('select[name="era"]') as HTMLSelectElement;
      
      let randomButton = getRandomButton();
      expect(randomButton).toBeDefined();
      expect(randomButton).not.toBeDisabled();

      await userEvent.selectOptions(eraSelect, "1");

      await waitFor(() => {
        randomButton = getRandomButton();
        expect(randomButton).toBeDefined();
        expect(randomButton).toBeDisabled();
      }, { timeout: 2000 });
    });
  });
});
