import React, { useState } from "react";
import { Input } from "../../../generic/form/Input";
import { addUser } from "../../../../services/user";
import { useNavigate } from "react-router-dom";

const AdminUserFormik = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const navigate = useNavigate()

  return (
    <div id="form" className="">
      <div className="bg-gray-300 rounded p-2">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-xl">Informations Principales :</h2>
        </div>
        <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
          <Input
            label="Pseudo"
            required
            inputType="text"
            inputName="username"
            colSpanWidth="6"
            attribute="username"
            data={user}
            setAction={setUser}
            // condition="put"
          />
          <Input
            label="Email"
            required
            inputType="email"
            inputName="email"
            colSpanWidth="6"
            attribute="email"
            data={user}
            setAction={setUser}
            // condition="put"
          />
        </div>
      </div>

      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => {
          console.log(user);
          addUser(user, navigate);
        }}
      >
        Créer un utilisateur
      </button>
    </div>
  );
};

export default AdminUserFormik;
