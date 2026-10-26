import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "../../../generic/form/input/Input";
import { InputPassword } from "../../../generic/form/inputPassword/InputPassword";
import { createUserByAdmin } from "../../../../services/user";
import { getArchetypesNames } from "../../../../services/archetype";
import { useNavigate } from "react-router-dom";
import MultiSelectInput from "../../../generic/form/MultiSelectInput";
import SelectInput from "../../../generic/form/SelectInput";
import CountrySelect from "../../../generic/form/CountrySelect";
import TextArea from "../../../generic/form/textArea/TextArea";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Archetype, UserForm } from "../../../../types";

type CreateUserForm = UserForm & {
  username: string;
  email: string;
  roles: string[];
  password: string;
  confirmPassword: string;
  send_invite_email: boolean;
  is_active: boolean;
  is_banned: boolean;
  biography: string;
  country: string;
  loved_archetype_id: string;
};

const AdminUserFormik = () => {
  const [user, setUser] = useState<CreateUserForm>({
    username: "",
    email: "",
    roles: ["User"],
    password: "",
    confirmPassword: "",
    send_invite_email: true,
    is_active: true,
    is_banned: false,
    biography: "",
    country: "",
    loved_archetype_id: "",
  });
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const roles = ["Admin", "User"];

  useEffect(() => {
    getArchetypesNames(setArchetypes);
  }, []);

  const handleCreate = async () => {
    if (!user.username.trim() || !user.email.trim()) {
      toast.error("Pseudo et email sont obligatoires");
      return;
    }
    if (!user.roles.length) {
      toast.error("Au moins un rôle est requis");
      return;
    }
    if (!user.send_invite_email) {
      if (!user.password || user.password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
      if (user.password !== user.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
    }

    setIsLoading(true);
    const payload: UserForm = {
      username: user.username.trim(),
      email: user.email.trim(),
      roles: user.roles,
      is_active: user.is_active,
      is_banned: user.is_banned,
      send_invite_email: user.send_invite_email,
      biography: user.biography.trim() || null,
      country: user.country || null,
      loved_archetype_id: user.loved_archetype_id || null,
      ...(user.send_invite_email
        ? {}
        : { password: user.password }),
    };
    await createUserByAdmin(payload, navigate, toast);
    setIsLoading(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4 max-w-3xl">
      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">
            Informations générales
          </h2>
          <div className="flex items-center gap-2">
            <SwitchInput
              label="Actif"
              attribute="is_active"
              data={user}
              setAction={setUser}
              displayRow
            />
            <SwitchInput
              label="Banni"
              attribute="is_banned"
              data={user}
              setAction={setUser}
              displayRow
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Input
            label="Pseudo"
            required
            inputType="text"
            inputName="username"
            colSpanWidth="6"
            attribute="username"
            data={user}
            setAction={setUser}
            placeholder="Ex: joueur42"
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
            placeholder="Ex: joueur@exemple.com"
          />
          <MultiSelectInput
            colSpanWidth="6"
            label="Rôles"
            required
            array={roles}
            data={user as { roles?: string[] }}
            setAction={
              setUser as React.Dispatch<
                React.SetStateAction<{ roles: string[] }>
              >
            }
          />
        </div>
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2 flex-wrap">
          <h2 className="font-semibold text-lg text-gray-900">Mot de passe</h2>
          <SwitchInput
            label="Envoyer invitation par email"
            attribute="send_invite_email"
            data={user}
            setAction={setUser}
            displayRow
          />
        </div>
        <p className="text-sm text-gray-600">
          {user.send_invite_email
            ? "Un email permettra à l'utilisateur de définir son mot de passe."
            : "Définissez un mot de passe initial (min. 8 caractères)."}
        </p>
        {!user.send_invite_email && (
          <div className="grid grid-cols-12 gap-4">
            <InputPassword
              label="Mot de passe"
              required
              attribute="password"
              data={user}
              setAction={setUser}
              colSpanWidth="6"
            />
            <InputPassword
              label="Confirmer le mot de passe"
              required
              attribute="confirmPassword"
              data={user}
              setAction={setUser}
              colSpanWidth="6"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-lg text-gray-900">Profil</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <TextArea
              label="Biographie"
              required={false}
              value={user.biography}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, biography: e.target.value }))
              }
            />
          </div>
          <SelectInput
            defaultOptionLabel="-- Archétype préféré --"
            label="Archétype préféré"
            options={archetypes.map((archetype) => ({
              id: archetype.id,
              label: archetype.name,
            }))}
            data={user}
            attribute="loved_archetype_id"
            setAction={setUser}
            colSpanWidth="6"
          />
          <div className="col-span-6">
            <CountrySelect
              label="Pays"
              value={user.country}
              onChange={(code) =>
                setUser((prev) => ({ ...prev, country: code }))
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          className="text-white px-4 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
          buttonText={isLoading ? "Création…" : "Créer l'utilisateur"}
          disabled={isLoading}
          action={() => {
            void handleCreate();
          }}
        />
      </div>
    </div>
  );
};

export default AdminUserFormik;
