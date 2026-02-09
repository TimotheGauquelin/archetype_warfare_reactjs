import React, { useEffect, useState } from 'react'
import { getEras } from '../../../../services/era';
import { getAttributes } from '../../../../services/attribute';
import { getTypes } from '../../../../services/type';
import { getSummonMechanics } from '../../../../services/summonmechanic';
import AdminArchetypeUpdateFormikData from './AdminArchetypeUpdateFormikData';
import AdminArchetypeUpdateFormikCardData from './AdminArchetypeUpdateFormikCardData';
import Button from '../../../generic/buttons/classicButton/Button';
import type { Archetype } from '../../../../types';

interface AdminArchetypeUpdateFormikProps {
  archetype: Archetype;
  setArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  updateArchetype: () => void;
  isLoading: boolean;
}

const AdminArchetypeUpdateFormik: React.FC<AdminArchetypeUpdateFormikProps> = ({ archetype, setArchetype, updateArchetype, isLoading }) => {
  const [eras, setEras] = useState<Array<{ id: number; label: string }>>([]);
  const [types, setTypes] = useState<Array<{ id: number; label: string }>>([]);
  const [attributes, setAttributes] = useState<Array<{ id: number; label: string }>>([]);
  const [summonMechanics, setSummonMechanics] = useState<Array<{ id: number; label: string }>>([]);
  const [activeTab, setActiveTab] = useState<"informations" | "cards">("informations");


  useEffect(() => {
    getEras(setEras);
    getAttributes(setAttributes);
    getTypes(setTypes);
    getSummonMechanics(setSummonMechanics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
      <div id="form" className="">
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
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 shadow-sm"
          buttonText="Modifier l'archetype"
          action={() => { updateArchetype()}} 
          disabled={isLoading}
          loadingText="Modification en cours..."
        />
      </div>
    </div>
  );
}

export default AdminArchetypeUpdateFormik