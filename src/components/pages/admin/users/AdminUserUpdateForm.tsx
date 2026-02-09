import { useEffect, useState } from "react";
import { Input } from "../../../generic/form/input/Input";
import { getUserById, updateUserByAdmin } from "../../../../services/user";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelectInput from "../../../generic/form/MultiSelectInput";
import { toast } from "react-toastify";
import Button from "../../../generic/buttons/classicButton/Button";
import { laborIllusion } from "../../../../utils/functions/laborIllusion/laborIllusion";
import type { User } from "../../../../types";

const AdminUserUpdateForm = () => {
  const [user, setUser] = useState<User>({
    id: null,
    username: null,
    email: null,
    roles: [],
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="tablet:grid tablet:grid-cols-12 gap-2">
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
        </div>
        <div className="grid grid-cols-12">
          <MultiSelectInput 
            colSpanWidth="6" 
            label="Roles" 
            required 
            array={roles} 
            data={{ roles: Array.isArray(user.roles) ? user.roles.filter((r): r is string => typeof r === 'string') : [] }} 
            setAction={(value) => {
              if (typeof value === 'function') {
                const newRoles = value({ roles: Array.isArray(user.roles) ? user.roles.filter((r): r is string => typeof r === 'string') : [] });
                setUser({ ...user, roles: newRoles.roles });
              } else {
                setUser({ ...user, roles: value.roles });
              }
            }} 
          />
        </div>
      </div>

      <Button
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 shadow-sm"
        buttonText="Modifier l'utilisateur"
        action={() => {
          setIsLoading(true);
          const userForm: { username?: string; email?: string; roles?: string[] } = {
            username: user.username ?? undefined,
            email: user.email ?? undefined,
            roles: Array.isArray(user.roles) ? user.roles.filter((r): r is string => typeof r === 'string') : []
          };
          laborIllusion(
            () => updateUserByAdmin(Number(userId), userForm, navigate, toast, setIsLoading),
            1
          );
        }}
        disabled={isLoading}
        loadingText="Modification en cours..."
      />
    </div>
  );
};

export default AdminUserUpdateForm;