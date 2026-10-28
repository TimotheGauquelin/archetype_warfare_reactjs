import React, { useEffect, useState } from "react";
import AdminArchetypeData from "./AdminArchetypeData";
import { getAttributes } from "../../../../services/attribute";
import { getTypes } from "../../../../services/type";
import { getEras } from "../../../../services/era";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import AdminArchetypeCards from "./AdminArchetypeCards";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Archetype, SetStateCallback } from "../../../../types";

interface Option {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface AdminArchetypeFormProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  addArchetype: () => void;
  isLoading: boolean;
}

const AdminArchetypeForm: React.FC<AdminArchetypeFormProps> = ({
  newArchetype,
  setNewArchetype,
  addArchetype,
  isLoading,
}) => {
  const [eras, setEras] = useState<Option[]>([]);
  const [types, setTypes] = useState<Option[]>([]);
  const [attributes, setAttributes] = useState<Option[]>([]);
  const [summonMechanics, setSummonMechanics] = useState<Option[]>([]);
  const [activeTab, setActiveTab] = useState("informations");

  useEffect(() => {
    getEras(setEras as unknown as SetStateCallback<Option[]>);
    getAttributes(setAttributes as unknown as SetStateCallback<Option[]>);
    getTypes(setTypes as unknown as SetStateCallback<Option[]>);
    getSummonMechanics(setSummonMechanics as unknown as SetStateCallback<Option[]>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabClass = (tab: string) =>
    `flex-1 text-center py-2 px-2 tablet:px-4 rounded-t-md cursor-pointer text-sm tablet:text-base ${
      activeTab === tab
        ? "text-blue-700 bg-blue-200 hover:bg-blue-300"
        : "text-gray-700 bg-gray-200 hover:bg-gray-300"
    }`;

  return (
    <div>
      <div className="flex gap-1">
        <button
          type="button"
          className={tabClass("informations")}
          onClick={() => setActiveTab("informations")}
        >
          Informations générales
        </button>
        <button
          type="button"
          className={tabClass("cards")}
          onClick={() => setActiveTab("cards")}
        >
          Cartes
        </button>
      </div>
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-2.5 tablet:p-4 space-y-4">
        <div className={activeTab === "informations" ? "space-y-4" : "hidden"}>
          <AdminArchetypeData
            eras={eras}
            attributes={attributes}
            types={types}
            summonMechanics={summonMechanics}
            newArchetype={newArchetype}
            setNewArchetype={setNewArchetype}
          />
        </div>
        <div className={activeTab === "cards" ? "space-y-4" : "hidden"}>
          <AdminArchetypeCards
            newArchetype={newArchetype}
            setNewArchetype={setNewArchetype}
          />
        </div>
        <Button
          className="w-full sscreen:w-auto text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
          buttonText="Créer l'archetype"
          disabled={isLoading}
          loadingText="Création en cours..."
          action={() => {
            addArchetype();
          }}
        />
      </div>
    </div>
  );
};

export default AdminArchetypeForm;
