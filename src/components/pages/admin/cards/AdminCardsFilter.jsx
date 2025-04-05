import React from "react";

const AdminCardsFilter = ({
  setPagination,
  cardTypes,
  attributes,
  criteria,
  setCriteria,
  resetAllFilters,
}) => {
  return (
    <div className="bg-slate-200 rounded p-2 mb-2">
      <div className="flex justify-between">
        <h2>Filtres : </h2>
        <p
          className="hover:text-red-500 cursor-pointer"
          onClick={() => {
            resetAllFilters();
          }}
        >
          Reset les filtres
        </p>{" "}
      </div>
      <div className="grid grid-cols-12 gap-2">
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Quelle carte recherchez-vous ?"
          type="text"
          value={criteria.name}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                name: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <input
          className="col-span-1 p-2 rounded"
          placeholder="Level"
          type="number"
          value={criteria.level}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                level: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <input
          className="col-span-1 p-2 rounded"
          placeholder="Atk <"
          type="number"
          step="50"
          min="0"
          max={5000}
          value={criteria.min_atk}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                min_atk: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <input
          className="col-span-1 p-2 rounded"
          placeholder="Atk >"
          type="number"
          step="50"
          min="0"
          max="5000"
          value={criteria.max_atk}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                max_atk: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <input
          className="col-span-1 p-2 rounded"
          placeholder="Def <"
          type="number"
          step="50"
          min="0"
          max={5000}
          value={criteria.min_def}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                min_def: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <input
          className="col-span-1 p-2 rounded"
          placeholder="Def >"
          type="number"
          step="50"
          min="0"
          max="5000"
          value={criteria.max_def}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                max_def: e.target.value,
              }));
              setPagination(1)
            }}
        />
        <select
          value={criteria.card_type}
          className="col-span-2 p-2 rounded"
          onChange={(e) => {
            setCriteria((prevState) => ({
              ...prevState,
              card_type: e.target.value,
            }));
            setPagination(1)
          }}
        >
          <option value="" defaultChecked>
            -- Aucun Type --
          </option>
          {cardTypes.map((era, index) => {
            return (
              <option key={index} value={era.label}>
                {era.label}
              </option>
            );
          })}
        </select>
        <select
          value={criteria.attribute}
          className="col-span-2 p-2 rounded"
          onChange={(e) => {
            setCriteria((prevState) => ({
              ...prevState,
              attribute: e.target.value,
            }));
            setPagination(1)
          }}
        >
          <option value="" defaultChecked>
            -- Aucun Attribut --
          </option>
          {attributes.map((attribute, index) => {
            return (
              <option key={index} value={attribute.label}>
                {attribute.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default AdminCardsFilter;
