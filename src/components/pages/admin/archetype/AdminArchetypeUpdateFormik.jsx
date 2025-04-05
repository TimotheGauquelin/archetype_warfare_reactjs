import React, { useEffect, useState } from 'react'
import { getEras } from '../../../../services/era';
import { getAttributes } from '../../../../services/attribute';
import { getTypes } from '../../../../services/type';
import { getSummonMechanics } from '../../../../services/summonmechanic';
import AdminArchetypeUpdateFormikData from './AdminArchetypeUpdateFormikData';
import AdminArchetypeUpdateFormikCardData from './AdminArchetypeUpdateFormikCardData';

const AdminArchetypeUpdateFormik = ({archetype, setArchetype, updateArchetype}) => {
  const [eras, setEras] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);

  useEffect(() => {
    getEras(setEras);
    getAttributes(setAttributes);
    getTypes(setTypes);
    getSummonMechanics(setSummonMechanics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="form" className="">
      <AdminArchetypeUpdateFormikData
        eras={eras}
        attributes={attributes}
        types={types}
        summonMechanics={summonMechanics}
        archetype={archetype}
        setArchetype={setArchetype}
      />

      <AdminArchetypeUpdateFormikCardData
        newArchetype={archetype}
        setNewArchetype={setArchetype}
      />

      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => {
          updateArchetype();
        }}
      >
        Modifier l'archetype
      </button>
    </div>
  );
}

export default AdminArchetypeUpdateFormik