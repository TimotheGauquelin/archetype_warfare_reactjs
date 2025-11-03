import React, { useEffect, useState } from "react";
import AdminArchetypeData from "./AdminArchetypeData";
import { getAttributes } from "../../../../services/attribute";
import { getTypes } from "../../../../services/type";
import { getEras } from "../../../../services/era";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import AdminArchetypeCards from "./AdminArchetypeCards";
import Button from "../../../generic/Button";

const AdminArchetypeForm = ({
  newArchetype,
  setNewArchetype,
  addArchetype,
  isLoading,
}) => {
  const [eras, setEras] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);
  const [activeTab, setActiveTab] = useState("informations");

  useEffect(() => {
    getEras(setEras);
    getAttributes(setAttributes);
    getTypes(setTypes);
    getSummonMechanics(setSummonMechanics);
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
        label="Créer l'archetype"
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
