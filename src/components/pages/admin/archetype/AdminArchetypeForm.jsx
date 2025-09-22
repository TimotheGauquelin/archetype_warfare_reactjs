import React, { useEffect, useState } from "react";
import AdminArchetypeData from "./AdminArchetypeData";
import { getAttributes } from "../../../../services/attribute";
import { getTypes } from "../../../../services/type";
import { getEras } from "../../../../services/era";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import AdminArchetypeCards from "./AdminArchetypeCards";

const AdminArchetypeForm = ({
  newArchetype,
  setNewArchetype,
  addArchetype,
}) => {
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
      <AdminArchetypeData
        eras={eras}
        attributes={attributes}
        types={types}
        summonMechanics={summonMechanics}
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
      />

      <AdminArchetypeCards
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
      />

      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => {
          // console.log(newArchetype)
          addArchetype();
        }}
      >
        Créer l'archetype
      </button>
    </div>
  );
};

export default AdminArchetypeForm;
