import React, { useEffect, useState } from "react";
import AdminArchetypeFormikData from "./AdminArchetypeFormikData";
import { getAttributes } from "../../../../services/attribute";
import { getTypes } from "../../../../services/type";
import { getEras } from "../../../../services/era";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import AdminArchetypeFormikCardData from "./AdminArchetypeFormikCardData";

const AdminArchetypeFormik = ({
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
      <AdminArchetypeFormikData
        eras={eras}
        attributes={attributes}
        types={types}
        summonMechanics={summonMechanics}
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
      />

      <AdminArchetypeFormikCardData
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
      />

      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => {
          addArchetype();
        }}
      >
        Créer l'archetype
      </button>
    </div>
  );
};

export default AdminArchetypeFormik;
