import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import type { Archetype } from "../../../../types";

interface AdminArchetypePaginationTableBodyProps {
  arrayItems: Archetype[];
  switchIsHighlighted: (archetypeId: number | string, setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
  switchIsActive: (archetypeId: number | string, setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
  deleteArchetype: (archetypeId: number | string, setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminArchetypePaginationTableBody: React.FC<AdminArchetypePaginationTableBodyProps> = ({
  arrayItems,
  switchIsHighlighted,
  switchIsActive,
  deleteArchetype,
  setRefresh
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
        const canToggleHighlight = Boolean(item?.is_highlighted) || hasValidSlider;
        const canToggleActive = Boolean(item?.is_active) || cardCount >= 5;

        return (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            key={index}
          >
            <div className={`col-span-2 p-1`}>{item?.name}</div>
            <div className={`col-span-1 p-1`}>
              {item?.attributes
                ?.map((attribute: { id: number; label: string }, index: number) => {
                  return <div key={index}>{ attributeToFrench(attribute?.label)}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 p-1`}>
              {item?.types
                ?.map((type: { id: number; label: string }, index: number) => {
                  return <div key={index}>{ monsterTypeToFrench(type?.label)}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 p-1`}>
              {item?.summon_mechanics
                ?.map((summonMechanic: { id: number; label: string }, index: number) => {
                  return (
                    <div key={index}>
                      {summonMechanicsToFrench(summonMechanic.label).replace("Invocation", "Invoc.")}
                    </div>
                  );
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 p-1`}>
              <div className="flex justify-center">
                <label
                  className={`inline-flex relative items-center mr-5 ${canToggleHighlight ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
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
              </div>
            </div>
            <div className={`col-span-1 p-1`}>
              <div className="flex justify-center">
                <label
                  className={`inline-flex relative items-center mr-5 ${canToggleActive ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
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
              </div>
            </div>
            <div className={`col-span-1 p-1`}>{item?.cards?.length ?? 0}</div>
            <div className={`col-span-1 p-1`}>{item?.popularity ?? (item as { popularity_poll?: number }).popularity_poll ?? 0}</div>
            <div className={`col-span-1 p-1`}>{null}</div>
            <div className="col-span-2 bg-gray-100 p-1 text-right">
              <p
                className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                onClick={() => {
                  deleteArchetype(item.id, setRefresh);
                }}
              >
                Supprimer
              </p>
              <Link
                className="hover:text-yellow-600 hover:underline cursor-pointer"
                to={`/admin/archetypes/update/${item.id}`}
              // state={{ request: "put", id: item.id }}
              >
                Modifier
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminArchetypePaginationTableBody;
