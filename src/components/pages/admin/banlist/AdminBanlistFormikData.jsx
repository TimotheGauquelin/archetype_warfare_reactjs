import { Field } from "formik";
import React from "react";
import { FormikSwitchInput } from "../../../generic/FormikSwitchInput";

const AdminBanlistFormikData = () => {
  return (
    <div className="bg-gray-300 rounded p-2">
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Informations Principales :</h2>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center px-2">
            <label className="mt-2 font-medium">En ligne</label>
            <Field
              className="mt-2"
              type="boolean"
              name="active"
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
          <Field className="mt-2 p-2" type="text" name="label" />
        </div>
        <div className="flex flex-col tablet:col-span-6">
          <label className="mt-2 font-medium">
            Date de sortie: <span className="text-red-500 font-bold">*</span>
          </label>
          <Field className="mt-2 p-2" type="date" name="releaseDate" />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mt-2 font-medium">
          Description: <span className="text-red-500 font-bold">*</span>
        </label>
        <Field className="mt-2 p-2" type="text" name="description" />
      </div>
    </div>
  );
};

export default AdminBanlistFormikData;
