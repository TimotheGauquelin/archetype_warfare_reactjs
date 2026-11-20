import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import AdminArchetypeFilter from "../archetype/AdminArchetypeFilter";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import {
  getAdminQuizSeason,
  updateAdminQuizSeason,
} from "../../../../services/quiz";
import { getArchetypesWithCriteria } from "../../../../services/archetype";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import type { Archetype, SearchCriteria } from "../../../../types";

interface AdminSeasonPlayableArchetypesTabProps {
  seasonId: number;
  active: boolean;
}

const PAGE_SIZE = 30;

const emptyFilters = (page = 1): SearchCriteria => ({
  name: "",
  era: "",
  type: "",
  attribute: "",
  summonmechanic: "",
  page,
  size: PAGE_SIZE,
  is_active: true,
});

const AdminSeasonPlayableArchetypesTab = ({
  seasonId,
  active,
}: AdminSeasonPlayableArchetypesTabProps) => {
  const [filters, setFilters] = useState<SearchCriteria>(() => emptyFilters());
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, setErrorMessage] = useState("");
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    (async () => {
      try {
        const season = await getAdminQuizSeason(seasonId);
        if (cancelled || dirtyRef.current) return;
        setSelectedIds(
          new Set(
            (season.playableArchetypes ?? [])
              .map((a) => Number(a.id))
              .filter((id) => Number.isFinite(id))
          )
        );
        setDirty(false);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Impossible de charger le pool d'archétypes"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active, seasonId]);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    const activeOnlyFilters: SearchCriteria = {
      ...filters,
      is_active: true,
    };
    void Promise.resolve(
      getArchetypesWithCriteria(
        activeOnlyFilters,
        setArchetypes,
        setPagination,
        setErrorMessage
      )
    ).finally(() => {
      setLoading(false);
      setRefresh(false);
    });
  }, [active, filters, refresh]);

  const resetAllFilters = () => {
    setFilters(emptyFilters(1));
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  const pageIds = useMemo(
    () =>
      archetypes.map((a) => Number(a.id)).filter((id) => Number.isFinite(id)),
    [archetypes]
  );

  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setDirty(true);
  };

  const togglePage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
    setDirty(true);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setDirty(true);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const updated = await updateAdminQuizSeason(seasonId, {
        playableArchetypeIds: [...selectedIds],
      });
      setSelectedIds(
        new Set(
          (updated.playableArchetypes ?? [])
            .map((a) => Number(a.id))
            .filter((id) => Number.isFinite(id))
        )
      );
      setDirty(false);
      toast.success(
        (updated.playableArchetypes?.length ?? 0) === 0
          ? "Pool vidé : tous les archétypes sont autorisés"
          : `Pool enregistré (${updated.playableArchetypes!.length} archétype(s))`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enregistrement impossible"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!active) return null;

  return (
    <div className="border border-t-0 rounded-b-md bg-white p-4 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Archétypes jouables (tournois officiels)
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Cochez les archétypes autorisés (en ligne uniquement). Aucune
            sélection = tous autorisés. Ne s&apos;applique qu&apos;aux tournois
            officiels rattachés à cette saison.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">
            {selectedIds.size === 0
              ? "Tous autorisés"
              : `${selectedIds.size} sélectionné(s)`}
          </span>
          {selectedIds.size > 0 ? (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={clearSelection}
            >
              Tout désélectionner
            </button>
          ) : null}
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={() => void onSave()}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer le pool"}
          </button>
        </div>
      </div>

      <AdminArchetypeFilter
        resetAllFilters={resetAllFilters}
        criteria={filters}
        setCriteria={(updater) => {
          setFilters((prev) => {
            const next =
              typeof updater === "function" ? updater(prev) : updater;
            const withActive: SearchCriteria = {
              ...next,
              is_active: true,
            };
            if (withActive.page !== 1 && withActive.page === prev.page) {
              return { ...withActive, page: 1 };
            }
            return withActive;
          });
        }}
        setRefresh={setRefresh}
        showGeneralActions={false}
      />

      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <PaginationTableHead
          tableHeadItem={[
            {
              colspan: "col-span-1",
              content: (
                <label
                  className="inline-flex flex-col items-center gap-0.5 cursor-pointer"
                  title="Sélectionner la page"
                >
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = somePageSelected && !allPageSelected;
                      }
                    }}
                    onChange={togglePage}
                    disabled={pageIds.length === 0}
                  />
                  <span className="text-[9px] font-semibold normal-case leading-tight text-center">
                    Sélectionner les archétypes
                  </span>
                </label>
              ),
            },
            { colspan: "col-span-4", label: "Nom" },
            { colspan: "col-span-2", label: "Attributs" },
            { colspan: "col-span-2", label: "Types" },
            { colspan: "col-span-2", label: "Invoc." },
            { colspan: "col-span-1", label: "Ère" },
          ]}
        />

        {loading ? (
          <p className="p-4 text-sm text-gray-500">Chargement…</p>
        ) : archetypes.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 text-center">
            Aucun archétype trouvé.
          </p>
        ) : (
          <div className="grid grid-cols-12 text-sm">
            {archetypes.map((item) => {
              const id = Number(item.id);
              const checked = selectedIds.has(id);
              const attributeLabels =
                item.attributes
                  ?.slice(0, 2)
                  .map((a) => attributeToFrench(a?.label))
                  .filter(Boolean) ?? [];
              const typeLabels =
                item.types
                  ?.slice(0, 2)
                  .map((t) => monsterTypeToFrench(t?.label))
                  .filter(Boolean) ?? [];
              const summonLabels =
                item.summon_mechanics
                  ?.slice(0, 2)
                  .map((sm) =>
                    summonMechanicsToFrench(sm.label).replace(
                      "Invocation",
                      "Invoc."
                    )
                  )
                  .filter(Boolean) ?? [];

              return (
                <label
                  key={id}
                  className={`col-span-12 grid grid-cols-12 items-center border-t border-gray-100 px-2 py-2 cursor-pointer hover:bg-blue-50 ${
                    checked ? "bg-blue-50/60" : ""
                  }`}
                >
                  <span className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(id)}
                    />
                  </span>
                  <span className="col-span-4 font-medium text-gray-900 truncate">
                    {item.name}
                  </span>
                  <span className="col-span-2 text-gray-700 truncate">
                    {attributeLabels.join(", ") || "—"}
                  </span>
                  <span className="col-span-2 text-gray-700 truncate">
                    {typeLabels.join(", ") || "—"}
                  </span>
                  <span className="col-span-2 text-gray-700 truncate">
                    {summonLabels.join(", ") || "—"}
                  </span>
                  <span className="col-span-1 text-gray-700 truncate">
                    {item.era?.label ?? "—"}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <PaginationFooter
        currentPage={pagination.currentPage}
        setPagination={(page) => {
          setFilters((prev) => ({ ...prev, page, is_active: true }));
        }}
        setRefresh={() => setRefresh(true)}
        itemsTotalCount={pagination.total}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
      />
    </div>
  );
};

export default AdminSeasonPlayableArchetypesTab;
