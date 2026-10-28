import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import type { Archetype } from "../../../../types";

interface AdminArchetypePaginationTableBodyProps {
  arrayItems: Archetype[];
  switchIsHighlighted: (
    archetypeId: number | string,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  switchIsActive: (
    archetypeId: number | string,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  deleteArchetype: (
    archetypeId: number | string,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminArchetypePaginationTableBody: React.FC<
  AdminArchetypePaginationTableBodyProps
> = ({
  arrayItems,
  switchIsHighlighted,
  switchIsActive,
  deleteArchetype,
  setRefresh,
}) => {
  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucun archétype trouvé.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      {arrayItems.map((item: Archetype, index: number) => {
        const cardCount = item?.cards?.length ?? 0;
        const hasValidSlider = Boolean(item?.slider_img_url?.trim());
        const canToggleHighlight =
          Boolean(item?.is_highlighted) || hasValidSlider;
        const canToggleActive = Boolean(item?.is_active) || cardCount >= 5;
        const popularity =
          item?.popularity ??
          (item as { popularity_poll?: number }).popularity_poll ??
          0;

        const attributeLabels =
          item?.attributes
            ?.slice(0, 2)
            .map((attribute) => attributeToFrench(attribute?.label))
            .filter(Boolean) ?? [];
        const typeLabels =
          item?.types
            ?.slice(0, 2)
            .map((type) => monsterTypeToFrench(type?.label))
            .filter(Boolean) ?? [];
        const summonLabels =
          item?.summon_mechanics
            ?.slice(0, 2)
            .map((sm) =>
              summonMechanicsToFrench(sm.label).replace("Invocation", "Invoc.")
            )
            .filter(Boolean) ?? [];

        const highlightToggle = (
          <label
            className={`inline-flex relative items-center ${
              canToggleHighlight
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            title={
              canToggleHighlight
                ? undefined
                : "Image slider requise pour mettre en avant"
            }
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item?.is_highlighted}
              disabled={!canToggleHighlight}
              onChange={() => {
                if (canToggleHighlight) {
                  switchIsHighlighted(item?.id, setRefresh);
                }
              }}
            />
            <CheckboxSlider />
          </label>
        );

        const activeToggle = (
          <label
            className={`inline-flex relative items-center ${
              canToggleActive
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            title={
              canToggleActive
                ? undefined
                : "Au moins 5 cartes requises pour mettre en ligne"
            }
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item?.is_active}
              disabled={!canToggleActive}
              onChange={() => {
                if (canToggleActive) {
                  switchIsActive(item?.id, setRefresh);
                }
              }}
            />
            <CheckboxSlider />
          </label>
        );

        const actions = (
          <>
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
              onClick={() => {
                deleteArchetype(item.id, setRefresh);
              }}
            >
              Supprimer
            </button>
            <Link
              className="hover:text-yellow-600 hover:underline cursor-pointer"
              to={`/admin/archetypes/update/${item.id}`}
            >
              Modifier
            </Link>
          </>
        );

        return (
          <div
            className="col-span-12 border-b border-l border-r hover:bg-slate-200"
            key={item.id ?? index}
          >
            {/* Mobile card */}
            <div className="sscreen:hidden p-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 leading-snug min-w-0 break-words">
                  {item?.name}
                </p>
                <div className="flex flex-col items-end gap-1 shrink-0 text-sm">
                  {actions}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Attributs</span>
                  <p>{attributeLabels.join(", ") || "—"}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Types</span>
                  <p>{typeLabels.join(", ") || "—"}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-800">
                    Méthode d&apos;invoc.
                  </span>
                  <p>{summonLabels.join(", ") || "—"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Slider</span>
                  {highlightToggle}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">En ligne</span>
                  {activeToggle}
                </div>
                <span className="text-xs text-gray-700">
                  {cardCount} carte{cardCount > 1 ? "s" : ""}
                </span>
                <span className="text-xs text-gray-700">
                  {popularity} pts
                </span>
              </div>
            </div>

            {/* Desktop row */}
            <div className="hidden sscreen:grid grid-cols-12 items-center cursor-pointer">
              <div className="col-span-2 p-1">{item?.name}</div>
              <div className="col-span-1 p-1">
                {attributeLabels.map((label, i) => (
                  <div key={i}>{label}</div>
                ))}
              </div>
              <div className="col-span-1 p-1">
                {typeLabels.map((label, i) => (
                  <div key={i}>{label}</div>
                ))}
              </div>
              <div className="col-span-1 p-1">
                {summonLabels.map((label, i) => (
                  <div key={i}>{label}</div>
                ))}
              </div>
              <div className="col-span-1 p-1">
                <div className="flex justify-center">{highlightToggle}</div>
              </div>
              <div className="col-span-1 p-1">
                <div className="flex justify-center">{activeToggle}</div>
              </div>
              <div className="col-span-1 p-1">{cardCount}</div>
              <div className="col-span-1 p-1">{popularity}</div>
              <div className="col-span-1 p-1">{null}</div>
              <div className="col-span-2 bg-gray-100 p-1 text-right flex flex-col items-end gap-0.5">
                {actions}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminArchetypePaginationTableBody;
