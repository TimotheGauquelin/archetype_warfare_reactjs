import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import UserHeroLayout from "../layout";
import PageContentBlock from "../../../components/generic/PageContentBlock";
import SelectInput from "../../../components/generic/form/SelectInput";
import { Input } from "../../../components/generic/form/input/Input";
import TournamentTable from "../../../components/pages/user/tournaments/TournamentTable";
import OfficialTournamentHighlight from "../../../components/pages/user/tournaments/OfficialTournamentHighlight";
import SeasonEventCollapsible from "../../../components/pages/user/season/SeasonEventCollapsible";
import type { SeasonHighlightItem } from "../../../components/pages/user/season/SeasonHighlight";
import { getTournaments } from "../../../services/tournament";
import {
  getQuizHub,
  getQuizSeasonTournamentRanking,
  type SeasonTournamentRankingEntry,
} from "../../../services/quiz";
import { useDebounce } from "@/utils/functions/debounce/useDebounce";
import {
  filterTournamentsByScope,
  type AdminTournamentScope,
} from "@/utils/tournament/adminTournamentScope";
import type { Tournament } from "../../../types";

type TournamentPhase = "" | "open" | "in_progress" | "finished";

type TournamentFilters = {
  name: string;
  location: string;
  event_date: string;
  is_official: "" | "true" | "false";
  phase: TournamentPhase;
} & Record<string, unknown>;

type SeasonTournamentBlock = {
  item: SeasonHighlightItem;
  podium: SeasonTournamentRankingEntry[];
};

const EMPTY_FILTERS: TournamentFilters = {
  name: "",
  location: "",
  event_date: "",
  is_official: "",
  phase: "",
};

const PHASE_TO_SCOPE: Record<
  Exclude<TournamentPhase, "">,
  AdminTournamentScope
> = {
  open: "upcoming",
  in_progress: "in-progress",
  finished: "past",
};

const toDateKey = (value: string | null | undefined): string => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const TournamentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TournamentFilters>(EMPTY_FILTERS);
  const debouncedName = useDebounce(filters.name, 400);
  const [seasonBlocks, setSeasonBlocks] = useState<SeasonTournamentBlock[]>([]);

  const officialOptions = useMemo(
    () => [
      { id: "true", label: t("tournamentsPage.official") },
      { id: "false", label: t("tournamentsPage.community") },
    ],
    [t]
  );

  const phaseOptions = useMemo(
    () => [
      { id: "open", label: t("tournamentsPage.phaseOpen") },
      { id: "in_progress", label: t("tournamentsPage.phaseInProgress") },
      { id: "finished", label: t("tournamentsPage.phaseFinished") },
    ],
    [t]
  );

  const loadTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      setTournaments(await getTournaments());
    } catch {
      setTournaments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSeasonHighlight = useCallback(async () => {
    try {
      const hub = await getQuizHub();
      const blocks =
        hub.seasonPodiums && hub.seasonPodiums.length > 0
          ? hub.seasonPodiums
          : hub.seasonPodium
            ? [hub.seasonPodium]
            : [];
      const currentItems = blocks
        .filter((b) => b.season.status === "current")
        .map((b) => ({ season: b.season, podium: b.podium }));

      const withRankings = await Promise.all(
        currentItems.map(async (item) => {
          try {
            const rankingData = await getQuizSeasonTournamentRanking(
              item.season.id
            );
            return {
              item,
              podium: (rankingData.ranking ?? []).slice(0, 3),
            };
          } catch {
            return { item, podium: [] as SeasonTournamentRankingEntry[] };
          }
        })
      );
      setSeasonBlocks(withRankings);
    } catch {
      setSeasonBlocks([]);
    }
  }, []);

  useEffect(() => {
    void loadTournaments();
  }, [loadTournaments]);

  useEffect(() => {
    void loadSeasonHighlight();
  }, [loadSeasonHighlight]);

  const filteredTournaments = useMemo(() => {
    const name = debouncedName.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const date = filters.event_date.trim();
    const official = filters.is_official;
    const phase = filters.phase;

    const byPhase = phase
      ? filterTournamentsByScope(tournaments, PHASE_TO_SCOPE[phase])
      : tournaments;

    return [...byPhase]
      .filter((tournament) => {
        if (name && !(tournament.name ?? "").toLowerCase().includes(name)) {
          return false;
        }
        if (
          location &&
          !(tournament.location ?? "").toLowerCase().includes(location)
        ) {
          return false;
        }
        if (date && toDateKey(tournament.event_date) !== date) {
          return false;
        }
        if (official === "true" && !tournament.is_official) return false;
        if (official === "false" && tournament.is_official) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = toDateKey(a.event_date);
        const dateB = toDateKey(b.event_date);
        return dateB.localeCompare(dateA);
      });
  }, [
    tournaments,
    debouncedName,
    filters.location,
    filters.event_date,
    filters.is_official,
    filters.phase,
  ]);

  return (
    <UserHeroLayout
      mainTitle={t("hero.tournaments.title")}
      subTitle={t("hero.tournaments.subtitle")}
    >
      <PageContentBlock>
        {seasonBlocks.length > 0 && (
          <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              {t("seasonHighlight.title")}
            </h2>
            {seasonBlocks.map(({ item, podium }, index) => (
              <SeasonEventCollapsible
                key={item.season.id}
                item={item}
                variant="tournaments"
                tournamentPodium={podium}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        )}
        {!isLoading && (
          <OfficialTournamentHighlight
            tournaments={tournaments}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          />
        )}
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-6">
            {t("tournamentsPage.loading")}
          </p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-gray-900">
              {t("tournamentsPage.allTournamentsTitle")}
            </h2>
            <div className="grid grid-cols-12 gap-2 tablet:gap-3 items-end">
              <div className="col-span-12 tablet:col-span-3">
                <Input
                  inputType="text"
                  inputName="name"
                  colSpanWidth="12"
                  attribute="name"
                  data={filters}
                  setAction={setFilters}
                  placeholder={t("tournamentsPage.searchPlaceholder")}
                />
              </div>
              <div className="col-span-6 tablet:col-span-2">
                <Input
                  inputType="text"
                  inputName="location"
                  colSpanWidth="12"
                  attribute="location"
                  data={filters}
                  setAction={setFilters}
                  placeholder={t("tournamentsPage.locationPlaceholder")}
                />
              </div>
              <div className="col-span-6 tablet:col-span-2">
                <Input
                  inputType="date"
                  inputName="event_date"
                  colSpanWidth="12"
                  attribute="event_date"
                  data={filters}
                  setAction={setFilters}
                />
              </div>
              <div className="col-span-6 tablet:col-span-2">
                <SelectInput
                  options={officialOptions}
                  inputName="is_official"
                  colSpanWidth="12"
                  attribute="is_official"
                  data={filters}
                  defaultOptionLabel={t("tournamentsPage.typePlaceholder")}
                  ariaLabel={t("tournamentsPage.typeLabel")}
                  setAction={setFilters}
                />
              </div>
              <div className="col-span-6 tablet:col-span-3">
                <SelectInput
                  options={phaseOptions}
                  inputName="phase"
                  colSpanWidth="12"
                  attribute="phase"
                  data={filters}
                  defaultOptionLabel={t("tournamentsPage.phasePlaceholder")}
                  ariaLabel={t("tournamentsPage.phaseLabel")}
                  setAction={setFilters}
                />
              </div>
            </div>
            <TournamentTable tournaments={filteredTournaments} />
          </div>
        )}
      </PageContentBlock>
    </UserHeroLayout>
  );
};

export default TournamentsPage;
