import { Field } from "formik";
import React, { useEffect, useState } from "react";
import api_aw from "../../../../api/api_aw";
import { FormikSelectInput } from "../../../generic/FormikSelectInput";

const DeckSearcher = ({
  deckCards,
  setDeckCards,
  setCurrentArchetypeId,
  setCurrentBanlistId,
  myDeck,
}) => {
  const [banlists, setBanlists] = useState([]);
  const [archetypes, setArchetypes] = useState([]);

  const emptyDeck = () => {
    //Modal pur prévenir que le deck va être vider
    setDeckCards([
      { label: "mainDeck", cards: [] },
      { label: "extraDeck", cards: [] },
    ]);
  };

  const getBanlists = () => {
    api_aw.get(`/public/banlists`).then((response) => {
      if (response.status === 200) {
        const banlists = [];
        response.data.forEach((banlist) => {
          banlists.push({
            value: banlist.id,
            label: banlist.label,
          });
        });
        setBanlists(banlists);
      }
    });
  };

  const getArchetypes = () => {
    api_aw.get(`/public/archetypes`).then((response) => {
      if (response.status === 200) {
        const archetypes = [];
        response.data.forEach((archetype) => {
          archetypes.push({
            value: archetype.id,
            label: archetype.name,
          });
        });
        setArchetypes(archetypes);
      }
    });
  };

  useEffect(() => {
    getArchetypes();
    getBanlists();
  }, []);

  return (
    <div className="bg-blue-200 w-full flex flex-row mb-2">
      <div className="w-[30%] bg-green-200 flex flex-col mr-2">
        <div className="flex flex-row justify-between mb-2">
          <label htmlFor="">Nom du deck: </label>
          <Field className="mt-2 p-2" type="text" name="label" />
        </div>
        <div className="flex flex-row justify-between mb-2">
          <label htmlFor="">Banlist:</label>
          <Field
            type="number"
            name="banlist"
            option={banlists}
            component={FormikSelectInput}
            deckData
            deckCards={deckCards}
            otherAction={setCurrentBanlistId}
          />
        </div>
        <div className="flex flex-row justify-between mb-2">
          <label htmlFor="">Archetype:</label>
          <Field
            type="number"
            name="archetype"
            option={archetypes}
            component={FormikSelectInput}
            deckData
            deckCards={deckCards}
            otherAction={setCurrentArchetypeId}
          />
        </div>
        <div className="flex flex-row justify-between">
          <button
            className="block p-2 submit bg-red-200 rounded-lg shadow cursor-pointer"
            id="form"
            type="submit"
            // onClick={() => {
            //   addDeck();
            // }}
          >
            Enregistrer
          </button>
          <div
            className="block p-2 submit bg-red-200 rounded-lg shadow cursor-pointer"
            onClick={() => {
              emptyDeck();
            }}
          >
            Vider
          </div>
          <div className="block p-2 submit bg-red-200 rounded-lg shadow">
            Supprimer
          </div>
        </div>
      </div>
      <div className="w-[70%] bg-orange-200"></div>
    </div>
  );
};

export default DeckSearcher;
