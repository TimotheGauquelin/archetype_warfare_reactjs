import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminTournamentTable from "@/components/pages/admin/archetype/adminTournaments/AdminTournamentTable";
import PaginationFooter from "@/components/generic/pagination/PaginationFooter";
import PopUp from "@/components/generic/PopUp";
import { Input } from "@/components/generic/form/input/Input";
import SelectInput from "@/components/generic/form/SelectInput";
import usePopup from "@/hooks/usePopup";
import {
  URL_FRONT_ADMIN_TOURNAMENT_ADD,
  URL_FRONT_ADMIN_TOURNAMENTS,
} from "@/constant/urlsFront";
import { deleteTournament, getAllTournaments } from "@/services/tournament";
import type { RootState } from "@/redux/store";
import type { Tournament } from "@/types";
import AdminLayout from "../../adminLayout";
import {
  ADMIN_TOURNAMENT_SCOPE_META,
  filterTournamentsByScope,
  isAdminTournamentScope,
} from "@/utils/tournament/adminTournamentScope";

const PAGE_SIZE = 30;

const OFFICIAL_OPTIONS = [
  { id: "true", label: "Officiel" },
  { id: "false", label: "Communautaire" },
];

type ScopeFilterForm = {
  location: string;
  event_date: string;
  is_official: "" | "true" | "false";
} & Record<string, unknown>;

const EMPTY_FILTERS: ScopeFilterForm = {
  location: "",
  event_date: "",
  is_official: "",
};

const toDateKey = (value: string | null | undefined): string => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const AdminTournamentsByScope = () => {
  const { scope: scopeParam } = useParams<{ scope: string }>();
  const { token } = useSelector((state: RootState) => state.user);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState<ScopeFilterForm>(EMPTY_FILTERS);

  const scope = isAdminTournamentScope(scopeParam) ? scopeParam : null;
  const meta = scope ? ADMIN_TOURNAMENT_SCOPE_META[scope] : null;

  const loadTournaments = useCallback(async () => {
    if (!token) {
      setTournaments([]);
      setLoading(false);
      toast.error("Authentification requise.");
      return;
    }
    setLoading(true);
    try {
      setTournaments(await getAllTournaments(token));
    } catch (e) {
      toast.error("Erreur lors du chargement des tournois.");
      console.error(e);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [token]);

  useEffect(() => {
    void loadTournaments();
  }, [loadTournaments, refresh]);

  useEffect(() => {
    setCurrentPage(1);
    setFilters(EMPTY_FILTERS);
  }, [scope]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filtered = useMemo(() => {
    if (!scope) return [];
    const byScope = filterTournamentsByScope(tournaments, scope);
    const location = filters.location.trim().toLowerCase();
    const date = filters.event_date.trim();
    const official = filters.is_official;

    return byScope.filter((tournament) => {
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
    });
  }, [tournaments, scope, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleRequestDelete = useCallback(
    (tournament: Tournament) => {
      showConfirmDialog({
        title: "Supprimer le tournoi",
        message: `Êtes-vous sûr de vouloir supprimer le tournoi « ${tournament.name} » ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        onConfirm: () => {
          if (!token) return;
          void (async () => {
            try {
              await deleteTournament(tournament.id, token);
              toast.success("Tournoi supprimé");
              await loadTournaments();
            } catch {
              toast.error("Impossible de supprimer le tournoi");
            }
          })();
        },
      });
    },
    [showConfirmDialog, token, loadTournaments]
  );

  if (!scope || !meta) {
    return <Navigate to={URL_FRONT_ADMIN_TOURNAMENTS} replace />;
  }

  return (
    <AdminLayout>
      <AdminBodyHeader
        label={meta.title}
        catchphrase={meta.catchphrase}
        buttonUrl={
          scope === "upcoming"
            ? URL_FRONT_ADMIN_TOURNAMENT_ADD
            : undefined
        }
        buttonLabel={
          scope === "upcoming"
            ? "Ajouter un tournoi"
            : undefined
        }
        returnButton
      />

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
        <p className="text-sm text-gray-600">{meta.description}</p>

        <div className="border border-gray-200 bg-slate-100 rounded p-2">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold">Filtres :</h2>
            <p
              className="hover:text-red-500 cursor-pointer text-sm"
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              Reset les filtres
            </p>
          </div>
          <div className="grid grid-cols-12 gap-2 sscreen:gap-4 items-end pt-2">
            <div className="col-span-6 sscreen:col-span-4">
              <Input
                attribute="location"
                data={filters}
                setAction={setFilters}
                placeholder="Lieu"
                inputType="text"
                colSpanWidth="12"
                label="Lieu"
              />
            </div>
            <div className="col-span-6 sscreen:col-span-4">
              <Input
                attribute="event_date"
                data={filters}
                setAction={setFilters}
                inputType="date"
                colSpanWidth="12"
                label="Date"
              />
            </div>
            <div className="col-span-6 sscreen:col-span-4">
              <SelectInput
                attribute="is_official"
                data={filters}
                setAction={setFilters}
                label="Type"
                defaultOptionLabel="-- Officiel / Communautaire --"
                options={OFFICIAL_OPTIONS}
                colSpanWidth="12"
                ariaLabel="Type de tournoi"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              {filtered.length} tournoi{filtered.length > 1 ? "s" : ""}
            </p>
            <AdminTournamentTable
              tournaments={paginated}
              emptyMessage={meta.emptyMessage}
              onRequestDelete={handleRequestDelete}
            />
            {filtered.length > 0 && (
              <PaginationFooter
                setRefresh={() => setRefresh((prev) => !prev)}
                currentPage={page}
                setPagination={setCurrentPage}
                itemsTotalCount={filtered.length}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
              />
            )}
          </>
        )}
      </section>

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </AdminLayout>
  );
};

export default AdminTournamentsByScope;
