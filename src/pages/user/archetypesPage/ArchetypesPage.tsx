import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/Archetypes.scss";
import { FaRandom } from "react-icons/fa";
import AbsoluteInput from "../../../components/generic/AbsoluteInput";
import PageContentBlock from "../../../components/generic/PageContentBlock";
import ArchetypeList from "../../../components/pages/home/ArchetypeList";
import {
  getArchetypesWithCriteria,
  getRandomArchetype,
} from "../../../services/archetype";
import SelectInput from "../../../components/generic/form/SelectInput";
import { Input } from "../../../components/generic/form/input/Input";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";
import type { Archetype, Pagination, RootState } from "../../../types";
import UserHeroLayout from "../layout";
import { useEras } from "../../../hooks/useEras";
import { useDebounce } from "@/utils/functions/debounce/useDebounce";
import { useTranslation } from "react-i18next";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";

const PAGE_SIZE = 12;

const ArchetypesPage = () => {
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { eras } = useEras();
  const [filters, setFilters] = useState({
    name: "",
    era: "",
    size: PAGE_SIZE,
    page: 1,
    is_active: true,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  const debouncedName = useDebounce(filters.name, 500);

  const handleRandomArchetype = useCallback(() => {
    setIsLoading(true);

    laborIllusion(async () => {
      try {
        await getRandomArchetype(navigate);
      } finally {
        setIsLoading(false);
      }
    }, 0.5);
  }, [navigate]);

  // Nouveau filtre → page 1 + liste vidée (skeleton).
  useEffect(() => {
    setFilters((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
    setArchetypes([]);
  }, [debouncedName, filters.era]);

  const loadData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const page = filters.page;
    const append = page > 1;
    try {
      if (append) setIsLoadingMore(true);
      else setIsFetching(true);
      setErrorMessage(null);

      const searchFilters = {
        name: debouncedName,
        era: filters.era,
        size: filters.size,
        page,
        is_active: filters.is_active,
      };

      await getArchetypesWithCriteria(
        searchFilters,
        (value) => {
          if (requestId !== requestIdRef.current) return;
          const incoming = Array.isArray(value) ? value : [];
          setArchetypes((prev) => {
            if (!append) return incoming;
            const seen = new Set(prev.map((a) => a.id));
            return [
              ...prev,
              ...incoming.filter((a) => a.id != null && !seen.has(a.id)),
            ];
          });
        },
        (value) => {
          if (requestId !== requestIdRef.current) return;
          setPagination(value);
        },
        (value) => {
          if (requestId !== requestIdRef.current) return;
          setErrorMessage(typeof value === "function" ? value("") : value);
        }
      );
    } catch {
      console.log("Erreur lors du chargement des archétypes");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsFetching(false);
        setIsLoadingMore(false);
      }
    }
  }, [
    debouncedName,
    filters.era,
    filters.size,
    filters.page,
    filters.is_active,
    locale,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Précharge l’image LCP (1ʳᵉ carte) dès qu’on a l’URL — fetchpriority natif sur le <link>
  useEffect(() => {
    const raw = archetypes[0]?.card_img_url;
    if (!raw) return;
    const href = optimizeImageUrl(raw, "card");
    if (!href) return;

    const existing = document.head.querySelector<HTMLLinkElement>(
      'link[data-lcp-preload="archetypes"]'
    );
    if (existing?.href === href) return;

    existing?.remove();
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.setAttribute("fetchpriority", "high");
    link.dataset.lcpPreload = "archetypes";
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [archetypes]);

  const eraOptions = useMemo(() => eras, [eras]);

  const isRandomButtonDisabled = useMemo(() => {
    const hasNameFilter = filters.name.trim() !== "";
    const hasEraFilter = filters.era !== "";
    const hasNoData = archetypes.length === 0;

    return hasNameFilter || hasEraFilter || hasNoData;
  }, [filters.name, filters.era, archetypes]);

  const hasMore =
    pagination.totalPages > 0
      ? pagination.currentPage < pagination.totalPages
      : archetypes.length < pagination.total;

  const handleSeeMore = () => {
    if (isFetching || isLoadingMore || !hasMore) return;
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <UserHeroLayout
      mainTitle={t("hero.archetypes.title")}
      subTitle={t("hero.archetypes.subtitle")}
    >
      <AbsoluteInput>
        <div className="col-span-12 tablet:col-span-6">
          <Input
            inputType="text"
            inputName="name"
            colSpanWidth="12"
            attribute="name"
            data={filters}
            setAction={setFilters}
            placeholder={t("archetypesPage.searchPlaceholder")}
          />
        </div>
        <div className="col-span-9 tablet:col-span-4">
          <SelectInput
            options={eraOptions}
            inputName="era"
            colSpanWidth="12"
            attribute="era"
            data={filters as Record<string, unknown>}
            defaultOptionLabel={t("archetypesPage.eraPlaceholder")}
            ariaLabel={t("archetypesPage.eraLabel")}
            setAction={
              setFilters as Dispatch<SetStateAction<Record<string, unknown>>>
            }
          />
        </div>
        <div className="col-span-3 tablet:col-span-2 flex">
          <Button
            style={{ backgroundColor: "#F95757" }}
            className="h-10 tablet:h-[42px] w-full mt-2 p-2 rounded-md flex justify-center items-center text-white"
            action={handleRandomArchetype}
            disabled={isLoading || isRandomButtonDisabled}
            ariaLabel={t("archetypesPage.randomArchetype")}
          >
            <FaRandom aria-hidden />
          </Button>
        </div>
      </AbsoluteInput>
      <PageContentBlock>
        <ArchetypeList
          dataArray={archetypes}
          isFetching={isFetching && archetypes.length === 0}
          skeletonItemCount={8}
          errorMessage={errorMessage}
        />
        {hasMore && archetypes.length > 0 ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSeeMore}
              disabled={isLoadingMore || isFetching}
            >
              {isLoadingMore
                ? t("archetypesPage.loadingMore")
                : t("archetypesPage.seeMore")}
            </button>
          </div>
        ) : null}
      </PageContentBlock>
    </UserHeroLayout>
  );
};

export default ArchetypesPage;
