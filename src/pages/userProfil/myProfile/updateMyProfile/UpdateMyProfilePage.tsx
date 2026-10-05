import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/generic/form/input/Input";
import { useSelector } from "react-redux";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { RootState } from "@/redux/store";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { UserUpdateForm } from "@/types";

const UpdateMyProfilePage = () => {
    const { t } = useTranslation();
    const {username: initialUsername, email: initialEmail,lovedArchetype: initialBelovedArchetype } = useSelector((state: RootState) => state.user);

    const [user, setUser] = useState<UserUpdateForm>({
        username: "",
        email: "",
        belovedArchetype: ""
    });

    useEffect(() => {
        setUser({
            username: initialUsername || "",
            email: initialEmail || "",
            belovedArchetype: (initialBelovedArchetype && typeof initialBelovedArchetype === 'string') ? initialBelovedArchetype : ""
        });
    }, [initialUsername, initialEmail, initialBelovedArchetype]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg shadow-sm p-4">
                <UserProfileLayoutTitle title={t("profile.editProfile")} returnButton={true} />
                
                <div className="grid grid-cols-12 gap-4">
                    <Input
                        label={t("profile.usernameLabel")}
                        required
                        inputType="text"
                        inputName="username"
                        colSpanWidth={6}
                        attribute="username"
                        data={user}
                        setAction={setUser}
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
                        data={user}
                        setAction={setUser}
                        placeholder={t("profile.emailPlaceholder")}
                        disabled
                    />
                </div>
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
        </UserProfilLayout >
    );
};

export default UpdateMyProfilePage;
