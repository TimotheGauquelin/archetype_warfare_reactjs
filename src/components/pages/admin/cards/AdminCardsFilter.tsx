import React from "react";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { cardTypeToFrench } from "../../../../utils/trad/cardType";
import type { CardSearchCriteria } from "../../../../types";

interface AdminCardsFilterProps {
  cardTypes: Array<{ id: number; label: string }>;
  attributes: Array<{ id: number; label: string }>;
  criteria: CardSearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<CardSearchCriteria>>;
  resetAllFilters: () => void;
}

const AdminCardsFilter: React.FC<AdminCardsFilterProps> = ({
  cardTypes,
  attributes,
  criteria,
  setCriteria,
  resetAllFilters,
}) => {
  return (
    <div className="bg-slate-200 rounded p-2 mb-2">
      <div className="flex justify-between mb-2">
        <p className="font-bold text-base">Filtres : </p>
        <p
          className="text-sm hover:text-red-500 cursor-pointer"
          onClick={() => {
            resetAllFilters();
          }}
        >
          Reset les filtres
        </p>{" "}
      </div>
      <div className="grid grid-cols-12 gap-1">
        <input
          className="col-span-4 p-2 rounded"
          placeholder="Quelle carte recherchez-vous ?"
          type="text"
          value={criteria.name}
          onChange={(e) => {
            setCriteria((prevState) => ({
              ...prevState,
              name: e.target.value,
              page: 1
            }));
          }}
        />
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Level"
          type="number"
          value={criteria.level ?? ''}
          onChange={(e) => {
            const levelValue = e.target.value === '' ? undefined : Number(e.target.value);
            setCriteria((prevState) => ({
              ...prevState,
              level: levelValue,
              page: 1
            }));
          }}
        />
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Atk <"
          type="number"
          step="50"
          min="0"
          max={5000}
          value={criteria.min_atk ?? ''}
          onChange={(e) => {
            const minAtkValue = e.target.value === '' ? undefined : Number(e.target.value);
            setCriteria((prevState) => ({
              ...prevState,
              min_atk: minAtkValue,
              page: 1
            }));
          }}
        />
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Atk >"
          type="number"
          step="50"
          min="0"
          max="5000"
          value={criteria.max_atk ?? ''}
          onChange={(e) => {
            const maxAtkValue = e.target.value === '' ? undefined : Number(e.target.value);
            setCriteria((prevState) => ({
              ...prevState,
              max_atk: maxAtkValue,
              page: 1
            }));
          }}
        />
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Def <"
          type="number"
          step="50"
          min="0"
          max={5000}
          value={criteria.min_def ?? ''}
          onChange={(e) => {
            const minDefValue = e.target.value === '' ? undefined : Number(e.target.value);
            setCriteria((prevState) => ({
              ...prevState,
              min_def: minDefValue,
              page: 1
            }));
          }}
        />
        <input
          className="col-span-2 p-2 rounded"
          placeholder="Def >"
          type="number"
          step="50"
          min="0"
          max={5000}
          value={criteria.max_def ?? ''}
          onChange={(e) => {
            const maxDefValue = e.target.value === '' ? undefined : Number(e.target.value);
            setCriteria((prevState) => ({
              ...prevState,
              max_def: maxDefValue,
              page: 1
            }));
          }}
        />
        <select
          value={criteria.card_type}
          className="col-span-3 p-2 rounded bg-white"
          onChange={(e) => {
            setCriteria((prevState) => ({
              ...prevState,
              card_type: e.target.value,
              page: 1
            }));
          }}
        >
          <option value="" defaultChecked>
            -- Aucun Type --
          </option>
          {cardTypes.map((cardType, index) => {
            return (
              <option key={index} value={cardType.label}>
                {cardTypeToFrench(cardType.label)}
              </option>
            );
          })}
        </select>
        <select
          value={criteria.attribute}
          className="col-span-3 p-2 bg-white rounded"
          onChange={(e) => {
            setCriteria((prevState) => ({
              ...prevState,
              attribute: e.target.value,
              page: 1
            }));
          }}
        >
          <option value="" defaultChecked>
            -- Aucun Attribut --
          </option>
          {attributes.map((attribute, index) => {
            return (
              <option key={index} value={attribute.label}>
                {attributeToFrench(attribute.label)}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default AdminCardsFilter;
