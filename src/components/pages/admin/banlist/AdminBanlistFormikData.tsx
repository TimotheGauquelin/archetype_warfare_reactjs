import React from "react";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/input/Input";
import type { Banlist } from "../../../../types";

interface AdminBanlistFormikDataProps {
  newBanlist: Banlist;
  setNewBanlist: React.Dispatch<React.SetStateAction<Banlist>>;
}

const AdminBanlistFormikData: React.FC<AdminBanlistFormikDataProps> = ({newBanlist, setNewBanlist}) => {
  return (
    <div className="bg-gray-300 rounded p-2">
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Informations Principales :</h2>
        <div className="flex justify-center items-center">
          <SwitchInput label="En ligne" attribute="is_active" data={newBanlist} setAction={setNewBanlist} />
        </div>
      </div>
      <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
        <Input
          label="Nom"
          required
          inputType="text"
          attribute="label"
          colSpanWidth="6"
          data={newBanlist}
          setAction={setNewBanlist}
        />

        <Input
          label="Date de sortie"
          required
          inputType="date"
          attribute="release_date"
          colSpanWidth="6"
          data={newBanlist}
          setAction={setNewBanlist}
        />
      </div>
      <div className="flex flex-col">
        <Input
          label="Description"
          required
          inputType="text"
          attribute="description"
          data={newBanlist}
          setAction={setNewBanlist}
        />
      </div>
    </div>
  );
};

export default AdminBanlistFormikData;
