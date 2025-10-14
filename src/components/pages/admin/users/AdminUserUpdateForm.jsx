import React, { useEffect, useState } from "react";
import { Input } from "../../../generic/form/Input";
import { getUserById, updateUserByAdmin } from "../../../../services/user";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelectInput from "../../../generic/form/MultiSelectInput";
import { toast } from "react-toastify";

const AdminUserUpdateForm = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    roles: [],
  });

  const { userId } = useParams();

  const navigate = useNavigate()

  const roles = [
    "Admin",
    "User"
  ];

  useEffect(() => {
    getUserById(Number(userId), setUser);
  }, [userId]);

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
          />
          <MultiSelectInput colSpanWidth="6" label="Roles" required array={roles} data={user} setAction={setUser} />
        </div>
      </div>

      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => {
            console.log("USER====", user);
          updateUserByAdmin(Number(userId), user, navigate, toast);
        }}
      >
        Modifier l'utilisateur
      </button>
    </div>
  );
};

export default AdminUserUpdateForm;