import React from "react";
import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";

const AdminArchetypePaginationTableBody = ({
  arrayItems,
  toggleHighlighted,
  toggleIsActive,
  deleteArchetype,
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
              {item?.summonMechanics
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
                    checked={item?.highlighted}
                    onChange={() => {
                      toggleHighlighted(item?.id);
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
                    checked={item?.isActive}
                    onChange={() => {
                      toggleIsActive(item?.id);
                    }}
                  />
                  <CheckboxSlider />
                </label>
              </div>
            </div>
            <div className={`col-span-1 px-3 py-4`}>{item?.cards?.length}</div>
            <div className={`col-span-1 px-3 py-4`}>{item.popularityPoll}</div>
            <div className={`col-span-2 px-3 py-4`}></div>
            <div className="col-span-1 px-6 py-4 text-right">
              <p
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  deleteArchetype(item.id, item.name);
                }}
              >
                Supprimer
              </p>
              <Link
                to="/admin/archetypes/form"
                state={{ request: "put", id: item.id }}
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
