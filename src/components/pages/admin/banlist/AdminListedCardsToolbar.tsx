import Button from "@/components/generic/buttons/classicButton/Button";
import type { BanlistCardLayout } from "@/components/generic/BanlistCard";
import {
  STATUS_FORBIDDEN,
  STATUS_LIMITED,
  STATUS_SEMI_LIMITED,
  STATUS_UNLIMITED,
} from "@/utils/const/banlistConst";
import { cardStatusToFrench } from "@/utils/trad/cardStatus";
import { FaList, FaTh, FaTrashAlt } from "react-icons/fa";

export type ListedCardStatusFilter =
  | "all"
  | typeof STATUS_FORBIDDEN
  | typeof STATUS_LIMITED
  | typeof STATUS_SEMI_LIMITED
  | typeof STATUS_UNLIMITED;

interface AdminListedCardsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ListedCardStatusFilter;
  onStatusFilterChange: (value: ListedCardStatusFilter) => void;
  viewMode: BanlistCardLayout;
  onViewModeChange: (value: BanlistCardLayout) => void;
  includeUnlimited?: boolean;
  onDeleteAll?: () => void;
  deleteAllDisabled?: boolean;
  searchAriaLabel?: string;
}

const STATUS_FILTERS: ListedCardStatusFilter[] = [
  "all",
  STATUS_FORBIDDEN,
  STATUS_LIMITED,
  STATUS_SEMI_LIMITED,
];

const AdminListedCardsToolbar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  includeUnlimited = false,
  onDeleteAll,
  deleteAllDisabled = false,
  searchAriaLabel = "Rechercher une carte",
}: AdminListedCardsToolbarProps) => {
  const filters = includeUnlimited
    ? [...STATUS_FILTERS, STATUS_UNLIMITED as ListedCardStatusFilter]
    : STATUS_FILTERS;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-2 tablet:px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">
        {filters.map((status) => {
          const active = statusFilter.toLowerCase() === status.toLowerCase();
          const label =
            status === "all" ? "Tous" : cardStatusToFrench(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                active
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Rechercher…"
        aria-label={searchAriaLabel}
        className="w-[140px] tablet:w-[180px] p-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="inline-flex rounded border border-gray-300 overflow-hidden">
        <button
          type="button"
          title="Grille 3 colonnes"
          aria-label="Affichage grille"
          aria-pressed={viewMode === "grid"}
          onClick={() => onViewModeChange("grid")}
          className={`px-2 py-1.5 ${
            viewMode === "grid"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaTh size={12} />
        </button>
        <button
          type="button"
          title="Liste"
          aria-label="Affichage liste"
          aria-pressed={viewMode === "list"}
          onClick={() => onViewModeChange("list")}
          className={`px-2 py-1.5 border-l border-gray-300 ${
            viewMode === "list"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaList size={12} />
        </button>
      </div>

      {onDeleteAll ? (
        <Button
          className="inline-flex items-center bg-red-100 hover:bg-red-200 text-red-600 px-2.5 py-1.5 rounded font-semibold shrink-0 text-sm ml-auto"
          buttonText="Tout supprimer"
          icon={<FaTrashAlt size={11} />}
          action={onDeleteAll}
          disabled={deleteAllDisabled}
        />
      ) : null}
    </div>
  );
};

export default AdminListedCardsToolbar;

export const matchesListedCardFilters = (
  cardName: string | undefined,
  cardStatusLabel: string | undefined,
  search: string,
  statusFilter: ListedCardStatusFilter
): boolean => {
  const q = search.trim().toLowerCase();
  if (q && !cardName?.toLowerCase().includes(q)) return false;

  if (statusFilter === "all") return true;
  return (cardStatusLabel ?? "").toLowerCase() === statusFilter.toLowerCase();
};
