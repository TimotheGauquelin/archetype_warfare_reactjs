import React, { useEffect, useState } from "react";
import { getEras } from "../../../../services/era";
import { getAttributes } from "../../../../services/attribute";
import { getTypes } from "../../../../services/type";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import AdminArchetypeUpdateFormikData from "./AdminArchetypeUpdateFormikData";
import AdminArchetypeUpdateFormikCardData from "./AdminArchetypeUpdateFormikCardData";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Archetype } from "../../../../types";

interface AdminArchetypeUpdateFormikProps {
  archetype: Archetype;
  setArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  updateArchetype: () => void;
  isLoading: boolean;
}

const AdminArchetypeUpdateFormik: React.FC<AdminArchetypeUpdateFormikProps> = ({
  archetype,
  setArchetype,
  updateArchetype,
  isLoading,
}) => {
  const [eras, setEras] = useState<Array<{ id: number; label: string }>>([]);
  const [types, setTypes] = useState<Array<{ id: number; label: string }>>([]);
  const [attributes, setAttributes] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [summonMechanics, setSummonMechanics] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [activeTab, setActiveTab] = useState<"informations" | "cards">(
    "informations"
  );

  useEffect(() => {
    getEras(setEras);
    getAttributes(setAttributes);
    getTypes(setTypes);
    getSummonMechanics(setSummonMechanics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabClass = (tab: "informations" | "cards") =>
    `py-2 px-4 rounded-t-md cursor-pointer ${
      activeTab === tab
        ? "text-blue-700 bg-blue-200 hover:bg-blue-300"
        : "text-gray-700 bg-gray-200 hover:bg-gray-300"
    }`;

  return (
    <div>
      <div className="flex">
        <span
          className={tabClass("informations")}
          onClick={() => setActiveTab("informations")}
        >
          Informations générales
        </span>
        <span
          className={tabClass("cards")}
          onClick={() => setActiveTab("cards")}
        >
          Cartes de l&apos;archétype
        </span>
      </div>
      <div
        id="form"
        className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-4"
      >
        <AdminArchetypeUpdateFormikData
          eras={eras}
          attributes={attributes}
          types={types}
          summonMechanics={summonMechanics}
          archetype={archetype}
          setArchetype={setArchetype}
          activeTab={activeTab}
        />

        <AdminArchetypeUpdateFormikCardData
          newArchetype={archetype}
          setNewArchetype={setArchetype}
          activeTab={activeTab}
        />

        <Button
          className="text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
          buttonText="Modifier l'archetype"
          action={() => {
            updateArchetype();
          }}
          disabled={isLoading}
          loadingText="Modification en cours..."
        />
      </div>
    </div>
  );
};

export default AdminArchetypeUpdateFormik;
