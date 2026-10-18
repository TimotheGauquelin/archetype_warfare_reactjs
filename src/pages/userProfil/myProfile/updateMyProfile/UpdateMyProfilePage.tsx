import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/generic/form/input/Input";
import { InputPassword } from "@/components/generic/form/inputPassword/InputPassword";
import TextArea from "@/components/generic/form/textArea/TextArea";
import SelectInput from "@/components/generic/form/SelectInput";
import CountrySelect from "@/components/generic/form/CountrySelect";
import Button from "@/components/generic/buttons/classicButton/Button";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { getArchetypesNames } from "@/services/archetype";
import { changeMyPassword, getUserById, updateMyProfile } from "@/services/user";
import { updateUser } from "@/redux/slice/userSlice";
import type { RootState } from "@/redux/store";
import type { Archetype, ChangePasswordForm, User, UserUpdateForm } from "@/types";

const UpdateMyProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, token, username: initialUsername, email: initialEmail } = useSelector(
    (state: RootState) => state.user
  );

  const [profile, setProfile] = useState<UserUpdateForm>({
    username: "",
    email: "",
    biography: "",
    country: "",
    loved_archetype_id: "",
  });
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    getArchetypesNames(setArchetypes);
  }, []);

  useEffect(() => {
    if (!id) return;

    getUserById(id, (userData) => {
      const user = userData as User;
      setProfile({
        username: user.username || initialUsername || "",
        email: user.email || initialEmail || "",
        biography: user.biography || "",
        country: user.country || "",
        loved_archetype_id:
          user.loved_archetype_id != null ? String(user.loved_archetype_id) : "",
      });
    });
  }, [id, initialUsername, initialEmail]);

  const handleSaveProfile = async () => {
    if (!id || !token) return;
    setIsSavingProfile(true);
    const updated = await updateMyProfile(
      id,
      {
        biography: profile.biography.trim() || null,
        country: profile.country || null,
        loved_archetype_id: profile.loved_archetype_id || null,
      },
      token,
      toast
    );
    if (updated) {
      dispatch(
        updateUser({
          biography: updated.biography ?? null,
          country: updated.country ?? null,
          loved_archetype_id: updated.loved_archetype_id ?? null,
          loved_archetype: updated.loved_archetype ?? null,
        })
      );
    }
    setIsSavingProfile(false);
  };

  const handleSavePassword = async () => {
    if (!id || !token) return;

    if (!passwordForm.currentPassword || !passwordForm.password || !passwordForm.confirmPassword) {
      toast.error(t("profile.passwordAllFieldsRequired"));
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error(t("auth.passwordsMismatch"));
      return;
    }

    setIsSavingPassword(true);
    const ok = await changeMyPassword(id, passwordForm, token, toast);
    if (ok) {
      setPasswordForm({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
    setIsSavingPassword(false);
  };

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <UserProfileLayoutTitle title={t("profile.editProfile")} returnButton={true} />

        <div className="grid grid-cols-12 gap-4">
          <Input
            label={t("profile.usernameLabel")}
            required
            inputType="text"
            inputName="username"
            colSpanWidth={6}
            attribute="username"
            data={profile}
            setAction={setProfile}
            placeholder={t("profile.usernamePlaceholder")}
            disabled
          />

          <Input
            label={t("profile.emailLabel")}
            required
            inputType="email"
            inputName="email"
            colSpanWidth={6}
            attribute="email"
            data={profile}
            setAction={setProfile}
            placeholder={t("profile.emailPlaceholder")}
            disabled
          />
        </div>

        <div className="grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-12 md:col-span-6">
            <TextArea
              label={t("profile.biographyLabel")}
              required={false}
              value={profile.biography}
              onChange={(e) => setProfile((prev) => ({ ...prev, biography: e.target.value }))}
            />
          </div>
          <div className="col-span-12 md:col-span-6 space-y-2">
            <SelectInput
              defaultOptionLabel={t("profile.selectFavoriteArchetype")}
              label={t("profile.favoriteArchetypeLabel")}
              required={false}
              options={archetypes.map((archetype) => ({
                id: archetype.id,
                label: archetype.name,
              }))}
              data={profile}
              attribute="loved_archetype_id"
              setAction={setProfile}
              colSpanWidth="12"
            />
            <CountrySelect
              label={t("profile.countryLabel")}
              value={profile.country}
              onChange={(code) =>
                setProfile((prev) => ({ ...prev, country: code }))
              }
              disabled={isSavingProfile}
            />
          </div>
        </div>

        <Button
          className="bg-blue-800 mt-4 hover:bg-blue-900 text-white px-4 py-2 rounded font-semibold shadow-sm"
          buttonText={t("profile.saveProfile")}
          action={handleSaveProfile}
          disabled={isSavingProfile}
          loadingText={t("profile.savingProfile")}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-lg font-bold mb-3">{t("profile.passwordSectionTitle")}</h3>
        <div className="grid grid-cols-12 gap-4">
          <InputPassword
            label={t("profile.currentPassword")}
            required
            attribute="currentPassword"
            name="currentPassword"
            data={passwordForm}
            setAction={setPasswordForm}
            colSpanWidth={12}
            disabled={isSavingPassword}
          />
          <InputPassword
            label={t("profile.newPassword")}
            required
            attribute="password"
            name="password"
            data={passwordForm}
            setAction={setPasswordForm}
            colSpanWidth={6}
            disabled={isSavingPassword}
          />
          <InputPassword
            label={t("profile.confirmNewPassword")}
            required
            attribute="confirmPassword"
            name="confirmPassword"
            data={passwordForm}
            setAction={setPasswordForm}
            colSpanWidth={6}
            disabled={isSavingPassword}
          />
        </div>
        <Button
          className="bg-blue-800 mt-4 hover:bg-blue-900 text-white px-4 py-2 rounded font-semibold shadow-sm"
          buttonText={t("profile.savePassword")}
          action={handleSavePassword}
          disabled={isSavingPassword}
          loadingText={t("profile.savingPassword")}
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserProfilLayout>
  );
};

export default UpdateMyProfilePage;
