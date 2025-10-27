import React, { useEffect, useState } from "react";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import Button from "../../components/generic/Button";
import { Input } from "../../components/generic/form/Input";
import ErrorText from "../../components/generic/ErrorText";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUser } from "../../redux/slice/userSlice";
import api_aw from "../../api/api_aw";

const UpdateMyProfil = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id, username: initialUsername, email: initialEmail, token, roles } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        username: "",
        email: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setUser({
            username: initialUsername || "",
            email: initialEmail || "",
        });
    }, [initialUsername, initialEmail]);

    const handleUpdate = () => {
        setError("");

        // Validation
        if (!user.username || !user.username.trim()) {
            setError("Le nom d'utilisateur est requis");
            return;
        }

        if (!user.email || !user.email.includes("@")) {
            setError("Veuillez saisir une adresse email valide");
            return;
        }

        setIsLoading(true);

        // Mise à jour via l'API
        api_aw
            .put(`/users/${id}`, user, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsLoading(false);

                    // Mise à jour du Redux store
                    dispatch(updateUser({
                        username: user.username,
                        email: user.email,
                        roles: roles,
                    }));

                    toast.success("Profil modifié avec succès !", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    });

                    setTimeout(() => {
                        navigate("/my-profil");
                    }, 2000);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError("Une erreur est survenue lors de la modification du profil");
                }
            });
    };

    return (
        <div>
            <Header />
            <Navbar />
            <ProfilTemplate>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-2xl font-bold mb-4 text-black">Modifier mes informations</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-12">
                            <Input
                                label="Nom d'utilisateur"
                                required
                                inputType="text"
                                inputName="username"
                                colSpanWidth="6"
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
                                colSpanWidth="6"
                                attribute="email"
                                data={user}
                                setAction={setUser}
                                placeholder="Entrez votre email"
                                disabled
                            />
                        </div>

                        <div className="grid grid-cols-12">
                            <Input
                                label="Archetype préféré"
                                required
                                inputType="text"
                                inputName="favoriteArchetype"
                                colSpanWidth="12"
                                attribute="favoriteArchetype"
                                data={user}
                                setAction={setUser}
                                placeholder="Entrez votre archetype préféré"
                            />
                        </div>


                        {error && (
                            <ErrorText errorText={error} errorTextCenter />
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                className="bg-black text-white px-6 py-3 rounded font-semibold transition-all duration-200 hover:opacity-90"
                                buttonText="Annuler"
                                disabled={isLoading}
                                action={() => navigate("/my-profil")}
                            />
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 shadow-sm"
                                buttonText="Enregistrer les modifications"
                                disabled={isLoading}
                                loadingText="Enregistrement en cours..."
                                action={handleUpdate}
                            />
                        </div>
                    </div>
                </div>
            </ProfilTemplate>

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
        </div>
    );
};

export default UpdateMyProfil;
