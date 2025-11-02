import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import { useSelector } from "react-redux";
import DeckData from "../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../components/generic/Button";
import { getDeckById, updateDeck } from "../../services/deck";
import { toast } from "react-toastify";
import { getArchetypesNames } from "../../services/archetype";

const MyDeckUpdate = () => {
    const navigate = useNavigate();
    const { deckId } = useParams();
    const { id, token } = useSelector((state) => state.user);

    const [myDeck, setMyDeck] = useState({
        label: "",
        comment: "",
        archetype_id: "",
        user_id: "",
    });

    const [archetypes, setArchetypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setIsFetching(true);
        getArchetypesNames(setArchetypes);
        getDeckById(
            token,
            deckId,
            setMyDeck,
            setIsFetching,
            toast,
            navigate
        );
    }, []);

    const handleUpdate = useCallback(() => {
        setIsLoading(true);
        updateDeck(
            token,
            deckId,
            myDeck,
            toast,
            navigate,
            setIsLoading
        );
    }, [deckId, myDeck]);

    return (
        <div>
            <Header />
            <Navbar />
            <ProfilTemplate>
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex flex-row justify-between items-center mb-4">
                        <h3 className="text-xl font-bold mb-4 text-black">
                            Modification d'un deck
                        </h3>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                        >
                            ← Retour
                        </button>
                    </div>

                    {!isFetching ? (
                        <>
                            <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
                            <Button
                                className="bg-blue-500 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                                buttonText="Modifier mon deck"
                                disabled={isLoading}
                                loadingText="Modification en cours..."
                                action={handleUpdate}
                            />
                        </>
                    ) : (
                        <div className="p-4 bg-gray-300 rounded-lg animate-pulse h-24">
                        </div>
                    )}
                </div>
            </ProfilTemplate>
        </div>
    );
};

export default MyDeckUpdate;