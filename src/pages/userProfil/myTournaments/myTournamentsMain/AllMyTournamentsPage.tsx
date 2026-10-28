import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import UserProfilLayout from "../../layout";
import TournamentTable from "@/components/pages/user/tournaments/TournamentTable";
import SelectInput from "@/components/generic/form/SelectInput";
import { Input } from "@/components/generic/form/input/Input";
import type { Tournament, RootState } from "@/types";
import { getMyTournaments } from "@/services/tournament";
import { URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";
import { useDebounce } from "@/utils/functions/debounce/useDebounce";
import {
  filterTournamentsByScope,
  type AdminTournamentScope,
} from "@/utils/tournament/adminTournamentScope";

type TournamentPhase = "" | "open" | "in_progress" | "finished";

type TournamentFilters = {
  name: string;
  location: string;
  event_date: string;
  phase: TournamentPhase;
} & Record<string, unknown>;

const EMPTY_FILTERS: TournamentFilters = {
  name: "",
  location: "",
  event_date: "",
  phase: "",
};

const PHASE_TO_SCOPE: Record<Exclude<TournamentPhase, "">, AdminTournamentScope> = {
  open: "upcoming",
  in_progress: "in-progress",
  finished: "past",
};

const toDateKey = (value: string | null | undefined): string => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const AllMyTournamentsPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TournamentFilters>(EMPTY_FILTERS);
  const debouncedName = useDebounce(filters.name, 400);

  const phaseOptions = useMemo(
    () => [
      { id: "open", label: t("tournamentsPage.phaseOpen") },
      { id: "in_progress", label: t("tournamentsPage.phaseInProgress") },
      { id: "finished", label: t("tournamentsPage.phaseFinished") },
    ],
    [t]
  );

  const loadMyTournaments = useCallback(async () => {
    if (!user.token) {
      setTournaments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const list = await getMyTournaments(user.token);
      setTournaments(list);
    } catch {
      setError(t("profile.loadTournamentsError"));
    } finally {
      setIsLoading(false);
    }
  }, [user.token, t]);

  useEffect(() => {
    void loadMyTournaments();
  }, [loadMyTournaments]);

  const filteredTournaments = useMemo(() => {
    const name = debouncedName.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const date = filters.event_date.trim();
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
        return true;
      })
      .sort((a, b) => {
        const dateA = toDateKey(a.event_date);
        const dateB = toDateKey(b.event_date);
        return dateB.localeCompare(dateA);
      });
  }, [tournaments, debouncedName, filters.location, filters.event_date, filters.phase]);

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-3 tablet:p-4 mb-2">
        <UserProfileLayoutTitle title={t("profile.allMyTournaments")} />

        <div className="grid grid-cols-12 gap-2 tablet:gap-3 mb-4 mt-3">
          <div className="col-span-12 tablet:col-span-4">
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
          <div className="col-span-12 tablet:col-span-3">
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

        {error && (
          <p className="text-red-600 text-sm mb-3" role="alert">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-gray-500 text-sm mb-3">{t("profile.loadingTournaments")}</p>
        ) : (
          <TournamentTable
            tournaments={filteredTournaments}
            emptyMessage={
              tournaments.length === 0
                ? t("profile.noTournaments")
                : t("profile.noTournamentsMatchFilters")
            }
            getDetailPath={(tournament) =>
              URL_FRONT_MY_TOURNAMENT_DETAIL(tournament.id)
            }
            showActions={false}
          />
        )}
      </div>
    </UserProfilLayout>
  );
};

export default AllMyTournamentsPage;
