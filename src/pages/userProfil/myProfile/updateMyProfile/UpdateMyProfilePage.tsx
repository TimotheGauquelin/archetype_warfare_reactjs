import { useEffect, useState } from "react";
import { Input } from "@/components/generic/form/input/Input";
import { useSelector } from "react-redux";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { RootState } from "@/redux/store";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { UserUpdateForm } from "@/types";

const UpdateMyProfilePage = () => {
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

    // const handleUpdate = () => {
    //     setError("");

    //     if (!user.username || !user.username.trim()) {
    //         setError("Le nom d'utilisateur est requis");
    //         return;
    //     }

    //     if (!user.email || !user.email.includes("@")) {
    //         setError("Veuillez saisir une adresse email valide");
    //         return;
    //     }

    //     setIsLoading(true);

    //     api_aw
    //         .put(`/users/${id}`, user, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 setIsLoading(false);

    //                 dispatch(updateUser({
    //                     username: user.username,
    //                     email: user.email,
    //                     belovedArchetype: user.belovedArchetype,
    //                     roles: roles.map((role) => typeof role === 'string' ? role : role.label),
    //                 }));

    //                 toast.success("Profil modifié avec succès !", {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                     hideProgressBar: false,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     theme: "light",
    //                 });

    //                 setTimeout(() => {
    //                     navigate(URL_FRONT_MY_PROFILE);
    //                 }, 2000);
    //             }
    //         })
    //         .catch((error) => {
    //             setIsLoading(false);
    //             if (error.response && error.response.data && error.response.data.message) {
    //                 setError(error.response.data.message);
    //             } else {
    //                 setError("Une erreur est survenue lors de la modification du profil");
    //             }
    //         });
    // };

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg shadow-sm p-4">
                <UserProfileLayoutTitle title="Modifier mon profil" returnButton={true} />
                
                <div className="grid grid-cols-12 gap-4">
                    <Input
                        label="Nom d'utilisateur"
                        required
                        inputType="text"
                        inputName="username"
                        colSpanWidth={6}
                        attribute="username"
                        data={user}
                        setAction={setUser}
                        placeholder="Entrez votre nom d'utilisateur"
                        disabled
                    />

                    <Input
                        label="Email"
                        required
                        inputType="email"
                        inputName="email"
                        colSpanWidth={6}
                        attribute="email"
                        data={user}
                        setAction={setUser}
                        placeholder="Entrez votre email"
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
