import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/input/Input";
import { CheckboxInput } from "../../../generic/form/CheckboxInput";
import { DateInput } from "../../../generic/form/DateInput";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { convertBase64 } from "../../../../utils/img/convertBase";
import type { Archetype } from "../../../../types";

interface Option {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface AdminArchetypeUpdateFormikDataProps {
  eras: Option[];
  attributes: Option[];
  types: Option[];
  summonMechanics: Option[];
  archetype: Archetype;
  setArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  activeTab: string;
}

const AdminArchetypeUpdateFormikData: React.FC<AdminArchetypeUpdateFormikDataProps> = ({
  eras,
  attributes,
  types,
  summonMechanics,
  archetype,
  setArchetype,
  activeTab,
}) => {

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-gray-300 rounded p-2 ${activeTab === "informations" ? "" : "hidden"}`}>
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Informations Principales :</h2>
        <div className="flex justify-center items-center">
          <SwitchInput
            label="Slider"
            attribute="is_highlighted"
            data={archetype}
            setAction={setArchetype}
            condition="put"
          />
          <SwitchInput
            label="En ligne"
            attribute="is_active"
            data={archetype}
            setAction={setArchetype}
            condition="put"
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
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
        <div className={`flex flex-col col-span-3`}>
          <label className="mt-2 font-medium">
            <span>Ere:</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select className="h-full p-2 rounded-md" value={archetype?.era?.id} onChange={(e) => {
            setArchetype((prevState: Archetype) => ({ ...prevState, era_id: Number(e.target.value) }))
          }}>
            <option value="" disabled>------</option>
            {eras?.map((option: Option, index: number) => {
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
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <DateInput
          label="Date d'apparition en TCG"
          required
          inputType="date"
          inputName="inTCGDate"
          colSpanWidth="6"
          attribute="in_tcg_date"
          data={archetype as Record<string, unknown>}
          min="2002-01-01"
          max={today}
          setAction={setArchetype as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          condition="put"
        />
        <DateInput
          label="Date d'apparition AW"
          required
          inputType="date"
          inputName="inAWDate"
          colSpanWidth="6"
          attribute="in_aw_date"
          data={archetype as Record<string, unknown>}
          min="2025-01-01"
          max={today}
          setAction={setArchetype as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          condition="put"
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
          data={archetype}
          setAction={setArchetype}
          condition="put"
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
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
      </div>
      <div className="flex flex-col">
        <Input
          label="Commentaire"
          inputType="text"
          inputName="comment"
          colSpanWidth="12"
          attribute="comment"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
      </div>
      {/* */}

      <CheckboxInput
        label="Mecanique d'invocation"
        required
        options={summonMechanics}
        colSpanWidth="12"
        attribute="summon_mechanics"
        data={archetype}
        setAction={setArchetype}
        translateLabel={summonMechanicsToFrench}
      />
      <CheckboxInput
        label="Types"
        required
        options={types}
        colSpanWidth="12"
        attribute="types"
        data={archetype}
        setAction={setArchetype}
        translateLabel={monsterTypeToFrench}
      />
      <CheckboxInput
        label="Attributs"
        required
        options={attributes}
        colSpanWidth="12"
        attribute="attributes"
        data={archetype}
        setAction={setArchetype}
        translateLabel={attributeToFrench}
      />
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4 mt-2 ">
        <div className={`flex flex-col col-span-12 tablet:col-span-6`}>
          <label className="font-medium">
            <span className="font-bold">Image du jumbotron de l'archetype:</span>
          </label>
          <div className="p-2 bg-gray-100 rounded-md mt-2">
            <img className="bg-gray-200 rounded-md border border-black" src={archetype.slider_img_url} alt="Jumbotron de l'archetype" />
          </div>
          <input className="mt-2" type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const base64Img = await convertBase64(file);
                if (base64Img && typeof base64Img === 'string') {
                  setArchetype((prevState: Archetype) => ({
                    ...prevState,
                    slider_img_url: base64Img,
                  }));
                }
              }
            }} />
        </div>
        <div className={`flex flex-col col-span-12 tablet:col-span-6`}>
          <label className="font-medium">
            <span className="font-bold">Image de la carte de l'archetype:</span>
          </label>
          <div className="w-[150px] h-[150px] p-2 bg-gray-100 rounded-md mt-2">
            <img className="" src={archetype.card_img_url} alt="Présentation de l'archetype" />
          </div>
          <input className="mt-2" type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const base64Img = await convertBase64(file);
                if (base64Img && typeof base64Img === 'string') {
                  setArchetype((prevState: Archetype) => ({
                    ...prevState,
                    card_img_url: base64Img,
                  }));
                }
              }
            }} />
        </div>
      </div>
    </div>
  );
};

export default AdminArchetypeUpdateFormikData;
