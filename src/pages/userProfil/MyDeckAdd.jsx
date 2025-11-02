import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import DeckCreator from "../../components/pages/userProfil/deckAdd/DeckCreator";
import { useSelector } from "react-redux";
import DeckData from "../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../components/generic/Button";
import { createDeck } from "../../services/deck";
import { toast } from "react-toastify";
import { getArchetypesNames } from "../../services/archetype";

const MyDeckAdd = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [myDeck, setMyDeck] = useState({
    label: "",
    comment: "",
    archetype_id: "",
    user_id: "",
    deck_cards: [],
  });

  const [archetypes, setArchetypes] = useState([]);

  useEffect(() => {
    getArchetypesNames(setArchetypes);
  }, []);

  const { id, token } = useSelector((state) => state.user);

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-row justify-between items-center mb-2">

            <h3 className="text-xl font-bold text-black">Création d'un deck</h3>
            <span className="cursor-pointer hover:text-green-400 transition-all duration-200" onClick={() => navigate(-1)}>Retour</span>
          </div>
          <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
          <DeckCreator myDeck={myDeck} setMyDeck={setMyDeck} />
          <Button
            className="bg-blue-500 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            buttonText="Créer le deck"
            action={() => { createDeck(token, myDeck, toast, navigate, setIsLoading) }}
            disabled={isLoading}
            loadingText="Création en cours..."
          />
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default MyDeckAdd;
