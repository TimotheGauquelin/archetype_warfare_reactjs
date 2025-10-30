import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";

const AdminArchetypePaginationTableBody = ({
  arrayItems,
  switchIsHighlighted,
  switchIsActive,
  deleteArchetype,
  setRefresh
}) => {
  return (
    <div className="grid grid-cols-12">
      {arrayItems?.map((item, index) => {
        return (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            key={index}
          >
            <div className={`col-span-2 px-3 py-4`}>{item?.name}</div>
            <div className={`col-span-1 px-3 py-4`}>
              {item?.attributes
                ?.map((attribute, index) => {
                  return <div key={index}>{ attributeToFrench(attribute?.label)}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {item?.types
                ?.map((type, index) => {
                  return <div key={index}>{ monsterTypeToFrench(type?.label)}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {item?.summon_mechanics
                ?.map((summonMechanic, index) => {
                  return (
                    <div key={index}>
                      {summonMechanicsToFrench(summonMechanic.label).replace("Invocation", "Invoc.")}
                    </div>
                  );
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              <div className="flex justify-center">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item?.is_highlighted}
                    onChange={() => {
                      switchIsHighlighted(item?.id, setRefresh);
                    }}
                  />
                  <CheckboxSlider />
                </label>
              </div>
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              <div className="flex justify-center">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item?.is_active}
                    onChange={() => {
                      switchIsActive(item?.id, setRefresh);
                    }}
                  />
                  <CheckboxSlider />
                </label>
              </div>
            </div>
            <div className={`col-span-1 px-3 py-4`}>{item?.cards?.length}</div>
            <div className={`col-span-1 px-3 py-4`}>{item.popularity_poll}</div>
            <div className={`col-span-1 px-3 py-4`}></div>
            <div className="col-span-2 bg-gray-100 p-4 text-right">
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
