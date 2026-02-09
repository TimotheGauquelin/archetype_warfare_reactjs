import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckCreator from "../../../../components/pages/userProfil/deckAdd/DeckCreator";
import { useSelector } from "react-redux";
import DeckData from "../../../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { createDeck } from "../../../../services/deck";
import { toast } from "react-toastify";
import { useArchetypesName } from "../../../../hooks/useArchetypesName";
import type { RootState } from "../../../../types";
import type { Deck } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";

const MyDeckAddPage = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const { archetypes } = useArchetypesName();
  const [myDeck, setMyDeck] = useState<Deck>({
    label: "",
    comment: "",
    archetype_id: undefined,
    user_id: undefined,
    deck_cards: [],
  });

  const { token } = useSelector((state: RootState) => state.user);

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <UserProfileLayoutTitle title="Création d'un deck" returnButton={true} />
        <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
        <DeckCreator myDeck={myDeck} setMyDeck={setMyDeck} />
        <Button
          className="bg-blue-500 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
          buttonText="Créer le deck"
          action={() => { if (token) createDeck(token, myDeck, toast, navigate, setIsLoading) }}
          disabled={isLoading}
          loadingText="Création en cours..."
        />
      </div>
    </UserProfilLayout>
  );
};

export default MyDeckAddPage;
