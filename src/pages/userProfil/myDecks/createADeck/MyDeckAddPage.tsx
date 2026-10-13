import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeckCreator from "../../../../components/pages/userProfil/deckAdd/DeckCreator";
import { useSelector } from "react-redux";
import DeckData from "../../../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { createDeck } from "../../../../services/deck";
import { toast } from "react-toastify";
import { isDeckCardLegalForArchetype } from "../../../../utils/deck/deckCardLegality";
import type { Archetype, RootState } from "../../../../types";
import type { Deck } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { getArchetypesNames } from "@/services/archetype";

const MyDeckAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [myDeck, setMyDeck] = useState<Deck>({
    label: "",
    comment: "",
    archetype_id: undefined,
    archetype: {
      id: 0,
      label: "",
      card_img_url: "",
      is_active: true,
    },
    user_id: undefined,
    deck_cards: [],
  });

  const { token } = useSelector((state: RootState) => state.user);
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  useEffect(() => {
    getArchetypesNames(setArchetypes);
  }, [locale]);

  const hasIllegalCards = useMemo(() => {
    return (myDeck.deck_cards ?? []).some(
      (deckCard) => !isDeckCardLegalForArchetype(deckCard, myDeck.archetype_id)
    );
  }, [myDeck.deck_cards, myDeck.archetype_id]);

  const handleCreate = () => {
    if (!token) return;
    if (hasIllegalCards) {
      toast.error(t("profile.cannotSaveIllegalCards"));
      return;
    }
    createDeck(token, myDeck, toast, navigate, setIsLoading);
  };

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <UserProfileLayoutTitle title={t("profile.createDeckTitle")} returnButton={true} />
        <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
        <DeckCreator myDeck={myDeck} setMyDeck={setMyDeck} />
        <Button
          className="bg-blue-800 mt-2 hover:bg-blue-900 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          buttonText={t("profile.createDeckButton")}
          action={handleCreate}
          disabled={isLoading || hasIllegalCards}
          loadingText={t("profile.creatingDeck")}
        />
      </div>
    </UserProfilLayout>
  );
};

export default MyDeckAddPage;
