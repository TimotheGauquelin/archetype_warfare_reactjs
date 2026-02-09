import React from "react";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/input/Input";
import { CheckboxInput } from "../../../generic/form/CheckboxInput";
import { convertBase64 } from "../../../../utils/img/convertBase";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import type { Archetype } from "../../../../types";

interface Option {
  id: number;
  label: string;
}

interface AdminArchetypeDataProps {
  eras: Option[];
  attributes: Option[];
  types: Option[];
  summonMechanics: Option[];
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
}

const AdminArchetypeData: React.FC<AdminArchetypeDataProps> = ({
  eras,
  attributes,
  types,
  summonMechanics,
  newArchetype,
  setNewArchetype,
}) => {

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gray-300 rounded p-2">
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Informations Principales :</h2>
        <div className="flex justify-center items-center">
          <SwitchInput
            label="Slider"
            attribute="is_highlighted"
            data={newArchetype}
            setAction={setNewArchetype}
          />
          <SwitchInput
            label="En ligne"
            attribute="is_active"
            data={newArchetype}
            setAction={setNewArchetype}
          />
        </div>
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <Input
          label="Nom"
          required
          inputType="text"
          inputName="nom"
          colSpanWidth="6"
          attribute="name"
          data={newArchetype}
          setAction={setNewArchetype}
        />
        <div className={`flex flex-col col-span-3`}>
          <label className="mt-2 font-medium">
            <span>Ere:</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            className="h-full rounded-md"
            name="era"
            value={newArchetype.era?.id || ""}
            onChange={(e) => {
              const selectedOption = eras.find((option: Option) => option.id === Number(e.target.value));
              setNewArchetype((prevState: Archetype) => ({
                ...prevState,
                era: selectedOption ? { id: selectedOption.id, label: selectedOption.label } : undefined
              }));
            }}
          >
            <option value="" disabled>------</option>
            {eras.map((option: Option, index: number) => {
              return <option key={index} value={option.id}>{option.label}</option>;
            })}
          </select>
        </div>
        <Input
          label="Point de popularité"
          required
          inputType="number"
          inputName="popularityPoll"
          colSpanWidth="3"
          attribute="popularity_poll"
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <Input
          label="Date d'apparition TCG"
          required
          inputType="date"
          inputName="inTCGDate"
          colSpanWidth="6"
          attribute="in_tcg_date"
          min="2002-01-01"
          max={today}
          data={newArchetype}
          setAction={setNewArchetype}
        />
        <Input
          label="Date d'apparition AW"
          required
          inputType="date"
          inputName="inAWDate"
          colSpanWidth="6"
          attribute="in_aw_date"
          min="2025-01-01"
          max={today}
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>
      <div className="flex flex-col">
        <Input
          label="Information principale"
          required
          inputType="text"
          inputName="mainInfo"
          colSpanWidth="12"
          attribute="main_info"
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>
      <div className="flex flex-col">
        <Input
          label="Information slider"
          required
          inputType="text"
          inputName="sliderInfo"
          colSpanWidth="12"
          attribute="slider_info"
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>
      <div className="flex flex-col">
        <Input
          label="Commentaire"
          inputType="text"
          inputName="comment"
          colSpanWidth="12"
          attribute="comment"
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>
      {/* */}

      <CheckboxInput
        label="Mecanique d'invocation"
        required
        options={summonMechanics}
        attribute="summon_mechanics"
        data={newArchetype}
        setAction={setNewArchetype}
        translateLabel={summonMechanicsToFrench}
      />
      <CheckboxInput
        label="Types"
        required
        options={types}
        attribute="types"
        data={newArchetype}
        setAction={setNewArchetype}
        translateLabel={monsterTypeToFrench}
      />
      <CheckboxInput
        label="Attributs"
        required
        options={attributes}
        attribute="attributes"
        data={newArchetype}
        setAction={setNewArchetype}
        translateLabel={attributeToFrench}
      />
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <div className={`flex flex-col col-span-12 tablet:col-span-6`}>
          <label className="mt-2 font-medium">
            <span className="font-bold">Image du jumbotron de l'archetype:</span>
          </label>
          <div className="p-2 bg-gray-100 rounded-md mt-2">
            {newArchetype.slider_img_url && (
              <div className="my-2">
                <p className="text-sm text-gray-600 mb-1">Prévisualisation :</p>
                <img
                  src={newArchetype.slider_img_url}
                  alt="Prévisualisation jumbotron"
                  className="max-w-full h-auto max-h-48 rounded border border-gray-300"
                />
              </div>
            )}
            <input
              className=""
              type='file'
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  setNewArchetype((prevState: Archetype) => ({
                    ...prevState,
                    slider_img_url: typeof base64Img === 'string' ? base64Img : undefined,
                  }));
                }
              }}
            />
          </div>
        </div>
        <div className={`flex flex-col col-span-12 tablet:col-span-6`}>
          <label className="mt-2 font-medium">
            <span className="font-bold">Image de la carte de l'archetype:</span>
          </label>
          <div className="p-2 mt-2 bg-gray-100 rounded-md">
            {newArchetype.card_img_url && (
              <div className="my-2">
                <p className="text-sm text-gray-600 mb-1">Prévisualisation :</p>
                <img
                  src={newArchetype.card_img_url}
                  alt="Prévisualisation carte"
                  className="max-w-full h-auto max-h-48 rounded border border-gray-300"
                />
              </div>
            )}
            <input
              className=""
              type='file'
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  setNewArchetype((prevState: Archetype) => ({
                    ...prevState,
                    card_img_url: typeof base64Img === 'string' ? base64Img : undefined,
                  }));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArchetypeData;