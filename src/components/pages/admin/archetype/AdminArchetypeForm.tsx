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

  return (
    <>
      <div className="flex">
        <span
          className={`py-2 px-4 rounded-t-md cursor-pointer ${activeTab === "informations" ? "text-blue-700 bg-blue-200 hover:bg-blue-300" : "text-gray-700 bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("informations")}
        >
          Informations Principales
        </span>
        <span
          className={`py-2 px-4 rounded-t-md cursor-pointer ${activeTab === "cards" ? "text-blue-700 bg-blue-200 hover:bg-blue-300" : "text-gray-700 bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("cards")}
        >
          Cartes de l'archetype
        </span>
      </div>
      <div className="">
        <div className={activeTab === "informations" ? "" : "hidden"}>
          <AdminArchetypeData
            eras={eras}
            attributes={attributes}
            types={types}
            summonMechanics={summonMechanics}
            newArchetype={newArchetype}
            setNewArchetype={setNewArchetype}
          />
        </div>
        <div className={activeTab === "cards" ? "" : "hidden"}>
          <AdminArchetypeCards
            newArchetype={newArchetype}
            setNewArchetype={setNewArchetype}
          />
        </div>
      </div>
      <Button
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        buttonText="Créer l'archetype"
        disabled={isLoading}
        loadingText="Création en cours..."
        action={() => {
          addArchetype();
        }}
      />

    </>
  );
};

export default AdminArchetypeForm;
