import React from "react";
import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM } from "../../../../constant/urlsFront";

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
                  return <div key={index}>{attribute?.label}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {item?.types
                ?.map((type, index) => {
                  return <div key={index}>{type?.label}</div>;
                })
                .slice(0, 2)}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {item?.summonmechanics
                ?.map((summonMechanic, index) => {
                  return (
                    <div key={index}>
                      {summonMechanic.label.replace("Invocation", "Invoc.")}
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
            <div className={`col-span-2 px-3 py-4`}></div>
            <div className="col-span-1 px-6 py-4 text-right">
              <p
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  deleteArchetype(item.id, setRefresh);
                }}
              >
                Supprimer
              </p>
              <Link
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
