import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import ArchetypePage from "./ArchetypePage";
import type { Archetype, BanlistCard } from "../../../types";
import { URL_BACK_GET_ARCHETYPE_BY_ID, URL_BACK_GET_ALL_CARD_TYPES } from "@/constant/urlsBack";
import userReducer from "../../../redux/slice/userSlice";
import cardTypeReducer from "../../../redux/slice/cardTypeSlice";

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
        reducer: { user: userReducer, cardType: cardTypeReducer },
    });
}

const API_BASE_URL = "http://localhost:8889/api";

const mockCardTypes = [
    { id: 1, label: "Monster", num_order: 1 },
    { id: 2, label: "Spell", num_order: 2 },
    { id: 3, label: "Trap", num_order: 3 },
];

const mockCards: BanlistCard[] = [
    {
        id: 1,
        card: {
            id: 1,
            name: "Dark Magician",
            card_type: "Monster",
            atk: 2500,
            level: 7,
            img_url: "https://example.com/dm.jpg",
        },
        card_status: {
            id: 1,
            label: "Unlimited",
        },
    },
    {
        id: 2,
        card: {
            id: 2,
            name: "Blue-Eyes White Dragon",
            card_type: "Monster",
            atk: 3000,
            level: 8,
            img_url: "https://example.com/be.jpg",
        },
        card_status: {
            id: 1,
            label: "Unlimited",
        },
    },
    {
        id: 3,
        card: {
            id: 3,
            name: "Dark Hole",
            card_type: "Spell",
            img_url: "https://example.com/dh.jpg",
        },
        card_status: {
            id: 1,
            label: "Unlimited",
        },
    },
];

const mockArchetype: Archetype = {
    id: 1,
    name: "Dark Magician",
    slider_img_url: "https://example.com/slider.jpg",
    card_img_url: "https://example.com/card.jpg",
    main_info: "Un archétype puissant de magicien",
    comment: "Cet archétype est très populaire",
    cards: mockCards,
    is_active: true,
    types: [
        {
            "id": 1,
            "label": "Spellcaster"
        }
    ],
    attributes: [
        {
            "id": 1,
            "label": "Dark"
        }
    ],
    summon_mechanics: [
        {
            "id": 1,
            "label": "Fusion Summon"
        }
    ],
};

let server: ReturnType<typeof setupServer>;

function renderArchetypePage(id: string = "1") {
    const store = createTestStore();
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[`/archetype/${id}`]}>
                <Routes>
                    <Route path="/archetype/:id" element={<ArchetypePage />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
}

describe("ArchetypePage (integration)", () => {
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
            http.get(`${API_BASE_URL}${URL_BACK_GET_ARCHETYPE_BY_ID("1")}`, () => {
                return HttpResponse.json(mockArchetype);
            }),
            http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_CARD_TYPES}`, () => {
                return HttpResponse.json({ data: mockCardTypes });
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
                http.get(`${API_BASE_URL}${URL_BACK_GET_ARCHETYPE_BY_ID("1")}`, async () => {
                    await new Promise((resolve) => setTimeout(resolve, 100000));
                    return HttpResponse.json(mockArchetype);
                }),
                http.get(`${API_BASE_URL}${URL_BACK_GET_ALL_CARD_TYPES}`, async () => {
                    await new Promise((resolve) => setTimeout(resolve, 100000));
                    return HttpResponse.json({ data: mockCardTypes });
                })
            );

            renderArchetypePage("1");

            expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
        });
    });

    describe("when APIs respond", () => {
        it("displays archetype data and cards", async () => {
            vi.useRealTimers();

            renderArchetypePage("1");

            await waitFor(() => {
                expect(screen.getByText("Dark Magician")).toBeInTheDocument();
            });

            expect(screen.getByTestId("jumbotron-main-title")).toHaveTextContent("Dark Magician");
            expect(screen.getByTestId("jumbotron-sub-title")).toHaveTextContent("Un archétype puissant de magicien");
            expect(screen.getByTestId("jumbotron-img")).toHaveAttribute("src", "https://example.com/slider.jpg");

            await waitFor(() => {
                const cardImages = screen.getAllByRole("img");
                const cardAlts = cardImages.map(img => img.getAttribute("alt")).filter(Boolean);
                expect(cardAlts).toContain("Dark Magician");
                expect(cardAlts).toContain("Blue-Eyes White Dragon");
                expect(cardAlts).toContain("Dark Hole");
            });
        });

        it("displays archetype comment when present", async () => {
          vi.useRealTimers();

          renderArchetypePage("1");

          await waitFor(() => {
            expect(screen.getByTestId("archetype-comment")).toHaveTextContent("Information : Cet archétype est très populaire");
          });
        });

        it("displays card count in subtitle", async () => {
          vi.useRealTimers();

          renderArchetypePage("1");

          await waitFor(() => {
            expect(screen.getByText(/Toutes les cartes \(3\)/)).toBeInTheDocument();
          });
        });

        it("displays NoItemMessage when archetype has no cards", async () => {
          vi.useRealTimers();

          const archetypeWithoutCards: Archetype = {
            ...mockArchetype,
            cards: [],
          };

          server.use(
            http.get(`${API_BASE_URL}${URL_BACK_GET_ARCHETYPE_BY_ID("1")}`, () => {
              return HttpResponse.json(archetypeWithoutCards);
            })
          );

          renderArchetypePage("1");

          await waitFor(() => {
            expect(screen.getByText("Il n'y a pas de carte dans cet archétype.")).toBeInTheDocument();
          });
        });
    });
});
