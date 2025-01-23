import { Field } from "formik";
import React, { useState } from "react";
import { FormikCheckboxInput } from "../../../generic/FormikCheckboxInput";
import { FormikSelectImageInput } from "../../../generic/FormikSelectImageInput";
import { FormikSelectInput } from "../../../generic/FormikSelectInput";
import { FormikSwitchInput } from "../../../generic/FormikSwitchInput";
import PerformancesInput from "../../../generic/PerformancesInput";
import { performancesLabel } from "../../../../constant/genericData";

const AdminArchetypeFormikData = ({
  eras,
  attributes,
  types,
  summonMechanics,
  jumbotronsOfArchetypes,
  headersOfArchetypes,
  requestPut,
}) => {
  const [jumbotronImg, setJumbotronImg] = useState("");
  console.log(jumbotronImg);

  const attributesEmptyArray = [];
  const typesEmptyArray = [];
  const summonMechanicsEmptyArray = [];

  return (
    <div className="bg-gray-300 rounded p-2">
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Informations Principales :</h2>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center px-2">
            <label className="mt-2 font-medium">Slider</label>
            <Field
              className="mt-2"
              type="boolean"
              name="highlighted"
              component={FormikSwitchInput}
            />
          </div>
          <div className="flex flex-col justify-center items-center px-2">
            <label className="mt-2 font-medium">En ligne </label>
            <Field
              className="mt-2"
              type="boolean"
              name="isActive"
              component={FormikSwitchInput}
            />
          </div>
        </div>
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <div className="flex flex-col tablet:col-span-6">
          <label className="mt-2 font-medium">
            Nom: <span className="text-red-500 font-bold">*</span>
          </label>
          <Field className="mt-2 p-2" type="text" name="name" />
        </div>
        <div className="flex flex-col tablet:col-span-6">
          <label className="mt-2 font-medium">
            Epoque d'apparition:{" "}
            <span className="text-red-500 font-bold">*</span>
          </label>
          <Field
            type="number"
            name="era"
            option={eras}
            component={FormikSelectInput}
          />
        </div>
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <div className="flex flex-col tablet:col-span-6">
          <label className="mt-2 font-medium">
            Point de popularité:{" "}
            <span className="text-red-500 font-bold">*</span>
          </label>
          <Field className="mt-2 p-2" type="number" name="popularityPoll" />
        </div>
        <div className="flex flex-col tablet:col-span-6">
          <label className="mt-2 font-medium">
            Date d'apparition: <span className="text-red-500 font-bold">*</span>
          </label>
          <Field className="mt-2 p-2" type="date" name="inGameDate" />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Information principale:{" "}
          <span className="text-red-500 font-bold">*</span>
        </label>
        <Field className="mt-2 p-2" type="text" name="mainInfo" />
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Information slider: <span className="text-red-500 font-bold">*</span>
        </label>
        <Field className="mt-2 p-2" type="text" name="sliderInfo" />
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">Commentaire: </label>
        <Field className="mt-2 p-2" type="text" name="comment" />
      </div>

      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Attributs: <span className="text-red-500 font-bold">*</span>
        </label>
        <Field
          type="number"
          name="attributes"
          option={attributes}
          array={attributesEmptyArray}
          component={FormikCheckboxInput}
        />
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Types: <span className="text-red-500 font-bold">*</span>
        </label>
        <Field
          type="number"
          name="types"
          option={types}
          array={typesEmptyArray}
          component={FormikCheckboxInput}
        />
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Mecanique d'invocation:{" "}
          <span className="text-red-500 font-bold">*</span>
        </label>
        <Field
          type="number"
          name="summonMechanics"
          option={summonMechanics}
          array={summonMechanicsEmptyArray}
          component={FormikCheckboxInput}
        />
      </div>
      <div className="block">
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
      </div>

      <div className="block grid grid-cols-12">
        <div className="flex flex-col col-span-6 h-1/2">
          <label className="mt-2 font-medium">
            Image d'entête: <span className="text-red-500 font-bold"></span>
          </label>
          <Field
            type="text"
            name="headerImg"
            littleImg
            option={headersOfArchetypes}
            component={FormikSelectImageInput}
          />
        </div>
        <div className="flex flex-col col-span-6">
          <label className="mt-2 font-medium">
            Image du jumbotron: <span className="text-red-500 font-bold"></span>
          </label>
          <img src={jumbotronImg} alt={jumbotronImg} />
          <Field
            type="text"
            name="jumbotronImg"
            otherAction={() => {
              setJumbotronImg();
            }}
            option={jumbotronsOfArchetypes}
            component={FormikSelectImageInput}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminArchetypeFormikData;
