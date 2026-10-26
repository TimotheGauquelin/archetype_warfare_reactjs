import { useEffect, useState } from "react";
import { Input } from "../../../generic/form/input/Input";
import { InputPassword } from "../../../generic/form/inputPassword/InputPassword";
import {
  adminSendPasswordReset,
  getUserById,
  updateUserByAdmin,
} from "../../../../services/user";
import { getArchetypesNames } from "../../../../services/archetype";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelectInput from "../../../generic/form/MultiSelectInput";
import SelectInput from "../../../generic/form/SelectInput";
import CountrySelect from "../../../generic/form/CountrySelect";
import TextArea from "../../../generic/form/textArea/TextArea";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { toast } from "react-toastify";
import Button from "../../../generic/buttons/classicButton/Button";
import { laborIllusion } from "../../../../utils/functions/laborIllusion/laborIllusion";
import type { Archetype, User, UserForm } from "../../../../types";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";

type UpdateFormState = {
  username: string;
  email: string;
  roles: string[];
  is_active: boolean;
  is_banned: boolean;
  biography: string;
  country: string;
  loved_archetype_id: string;
  password: string;
  confirmPassword: string;
};

const AdminUserUpdateForm = () => {
  const [form, setForm] = useState<UpdateFormState>({
    username: "",
    email: "",
    roles: [],
    is_active: true,
    is_banned: false,
    biography: "",
    country: "",
    loved_archetype_id: "",
    password: "",
    confirmPassword: "",
  });
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const { userId } = useParams();
  const navigate = useNavigate();
  const roles = ["Admin", "User"];

  useEffect(() => {
    getArchetypesNames(setArchetypes);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getUserById(String(userId), (userData) => {
      const user = userData as User;
      setForm({
        username: user.username ?? "",
        email: user.email ?? "",
        roles: Array.isArray(user.roles)
          ? user.roles.filter((r): r is string => typeof r === "string")
          : [],
        is_active: Boolean(user.is_active),
        is_banned: Boolean(user.is_banned),
        biography: user.biography ?? "",
        country: user.country ?? "",
        loved_archetype_id:
          user.loved_archetype_id != null
            ? String(user.loved_archetype_id)
            : "",
        password: "",
        confirmPassword: "",
      });
    });
  }, [userId]);

  const handleSave = () => {
    if (!userId) return;
    if (form.password) {
      if (form.password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
    }

    setIsLoading(true);
    const userForm: UserForm = {
      username: form.username,
      email: form.email,
      roles: form.roles,
      is_active: form.is_active,
      is_banned: form.is_banned,
      biography: form.biography.trim() || null,
      country: form.country || null,
      loved_archetype_id: form.loved_archetype_id || null,
      ...(form.password ? { password: form.password } : {}),
    };

    laborIllusion(
      () =>
        updateUserByAdmin(
          String(userId),
          userForm,
          navigate,
          toast,
          setIsLoading
        ),
      1
    );
  };

  const handleSendReset = () => {
    if (!userId) return;
    showConfirmDialog({
      title: "Envoyer un reset password",
      message: `Envoyer un email de réinitialisation à « ${form.email} » ?`,
      confirmText: "Envoyer",
      cancelText: "Annuler",
      onConfirm: () => {
        setIsSendingReset(true);
        void adminSendPasswordReset(String(userId), toast).finally(() =>
          setIsSendingReset(false)
        );
      },
    });
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">
            Informations générales
          </h2>
          <div className="flex items-center gap-2">
            <SwitchInput
              label="Actif"
              attribute="is_active"
              data={form}
              setAction={setForm}
              displayRow
            />
            <SwitchInput
              label="Banni"
              attribute="is_banned"
              data={form}
              setAction={setForm}
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
            data={form}
            setAction={setForm}
          />
          <Input
            label="Email"
            required
            inputType="email"
            inputName="email"
            colSpanWidth="6"
            attribute="email"
            data={form}
            setAction={setForm}
          />
          <MultiSelectInput
            colSpanWidth="6"
            label="Rôles"
            required
            array={roles}
            data={{ roles: form.roles }}
            setAction={(value) => {
              if (typeof value === "function") {
                const next = value({ roles: form.roles });
                setForm((prev) => ({ ...prev, roles: next.roles }));
              } else {
                setForm((prev) => ({ ...prev, roles: value.roles }));
              }
            }}
          />
        </div>
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-lg text-gray-900">Profil</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <TextArea
              label="Biographie"
              required={false}
              value={form.biography}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, biography: e.target.value }))
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
            data={form}
            attribute="loved_archetype_id"
            setAction={setForm}
            colSpanWidth="6"
          />
          <div className="col-span-6">
            <CountrySelect
              label="Pays"
              value={form.country}
              onChange={(code) =>
                setForm((prev) => ({ ...prev, country: code }))
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-lg text-gray-900">Mot de passe</h2>
        <p className="text-sm text-gray-600">
          Forcez un nouveau mot de passe, ou envoyez un email de
          réinitialisation.
        </p>
        <div className="grid grid-cols-12 gap-4">
          <InputPassword
            label="Nouveau mot de passe"
            attribute="password"
            data={form}
            setAction={setForm}
            colSpanWidth="6"
          />
          <InputPassword
            label="Confirmer"
            attribute="confirmPassword"
            data={form}
            setAction={setForm}
            colSpanWidth="6"
          />
        </div>
        <div>
          <Button
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded font-semibold disabled:opacity-50"
            buttonText={
              isSendingReset
                ? "Envoi…"
                : "Envoyer un email de réinitialisation"
            }
            disabled={isSendingReset || !form.email}
            action={handleSendReset}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          className="text-white px-4 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
          buttonText="Modifier l'utilisateur"
          action={handleSave}
          disabled={isLoading}
          loadingText="Modification en cours..."
        />
      </div>

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </div>
  );
};

export default AdminUserUpdateForm;
