import React from "react";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/Input";
import SelectInput from "../../../generic/form/SelectInput";
import { CheckboxInput } from "../../../generic/form/CheckboxInput";

const AdminArchetypeUpdateFormikData = ({
  eras,
  attributes,
  types,
  summonMechanics,
  archetype,
  setArchetype,
}) => {

  return (
    <div className="bg-gray-300 rounded p-2">
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
        <SelectInput
          label="Epoque d'apparition"
          options={eras}
          inputName="era"
          required
          colSpanWidth="3"
          attribute="era_id"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
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
        <Input
          label="Date d'apparition en TCG"
          required
          inputType="date"
          inputName="inTCGDate"
          colSpanWidth="6"
          attribute="in_tcg_date"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
        <Input
          label="Date d'apparition AW"
          required
          inputType="date"
          inputName="inAWDate"
          colSpanWidth="6"
          attribute="in_aw_date"
          data={archetype}
          setAction={setArchetype}
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
        colSpanWidth
        attribute="summonmechanics"
        data={archetype}
        setAction={setArchetype}
        condition="put"
      />
      <CheckboxInput
        label="Types"
        required
        options={types}
        colSpanWidth
        attribute="types"
        data={archetype}
        setAction={setArchetype}
        condition="put"
      />
      <CheckboxInput
        label="Attributs"
        required
        options={attributes}
        colSpanWidth
        attribute="attributes"
        data={archetype}
        setAction={setArchetype}
        condition="put"
      />
      {/* <div className="block">
        <label className="mt-2 font-medium">
          Performances: <span className="text-red-500 font-bold">*</span>
        </label>

        <Field
          type="number"
          name="performances"
          arrayLabel={performancesLabel}
          component={PerformancesInput}
          put={requestPut}
        />
      </div> */}
    </div>
  );
};

export default AdminArchetypeUpdateFormikData;
