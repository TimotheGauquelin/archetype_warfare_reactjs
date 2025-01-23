import React from "react";

const AdminCardsFilter = ({
  pagination,
  setPagination,
  criteriaName,
  setCriteriaName,
  criteriaAtk,
  setCriteriaAtk,
  criteriaDef,
  setCriteriaDef,
  criteriaLevel,
  setCriteriaLevel,
  cardTypes,
  criteriaCardTypes,
  setCriteriaCardTypes,
  criteriaMonsterType,
  setCriteriaMonsterType,
  criteriaMonsterAttribute,
  setCriteriaMonsterAttribute,
  monsterAttributes,
  monsterTypes,
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
      <div className="flex justify-between items-center">
        <input
          className="w-1/3 p-2 rounded"
          placeholder="Quelle carte recherchez-vous ?"
          type="text"
          value={criteriaName}
          onChange={(e) => {
            setCriteriaName(e.target.value);
          }}
        />
        <select
          value={criteriaCardTypes}
          className="w-1/3 p-2 rounded"
          onChange={(e) => {
            setCriteriaCardTypes(e.target.value);
            setPagination(0);
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
      </div>
      {criteriaCardTypes.includes("Monster") && (
        <div className="grid grid-cols-12 gap-2 pt-2">
          <input
            className="col-span-2 p-2 rounded"
            placeholder="Quelle ATK ?"
            type="number"
            min="0"
            value={criteriaAtk}
            onChange={(e) => {
              setCriteriaAtk(e.target.value);
              setPagination(0);
            }}
          />
          <input
            className="col-span-2 p-2 rounded"
            placeholder="Quelle DEF ?"
            type="number"
            min="0"
            value={criteriaDef}
            onChange={(e) => {
              setCriteriaDef(e.target.value);
              setPagination(0);
            }}
          />
          <input
            className="col-span-2 p-2 rounded"
            placeholder="Quel niveau ?"
            type="number"
            min="0"
            max="12"
            value={criteriaLevel}
            onChange={(e) => {
              setCriteriaLevel(e.target.value);
              setPagination(0);
            }}
          />
          <select
            value={criteriaMonsterType}
            className="col-span-2 p-2 rounded"
            onChange={(e) => {
              setCriteriaMonsterType(e.target.value);
              setPagination(0);
            }}
          >
            <option value="" defaultChecked>
              -- Aucun Type --
            </option>
            {monsterTypes
              ?.sort((a, b) => a.label.localeCompare(b.label))
              .map((monsterType, index) => {
                return (
                  <option key={index} value={monsterType.label}>
                    {monsterType.label}
                  </option>
                );
              })}
          </select>
          <select
            value={criteriaMonsterAttribute}
            className="col-span-2 p-2 rounded"
            onChange={(e) => {
              setCriteriaMonsterAttribute(e.target.value);
              setPagination(0);
            }}
          >
            <option value="" defaultChecked>
              -- Aucun Attribut --
            </option>
            {monsterAttributes
              ?.sort((a, b) => a.label.localeCompare(b.label))
              .map((monsterAttribute, index) => {
                return (
                  <option key={index} value={monsterAttribute.label}>
                    {monsterAttribute.label}
                  </option>
                );
              })}
          </select>
        </div>
      )}
    </div>
  );
};

export default AdminCardsFilter;
