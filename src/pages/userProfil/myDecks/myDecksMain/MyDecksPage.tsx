import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getMyDecks } from "../../../../services/deck";
import { URL_FRONT_MY_DECK_ADD, getMyDeckUpdatePath } from "../../../../constant/urlsFront";
import type { DeckWithArchetypeDetails, RootState } from "../../../../types";
import UserProfilLayout from "../../layout";
import NoItemMessage from "@/components/generic/NoItemMessage";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import MyDecksDivSkeleton from "@/components/skeletons/MyDecksDivSkeleton";

const MyDecksPage = () => {
  const [myDecks, setMyDecks] = useState<DeckWithArchetypeDetails[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && id) {
      getMyDecks(token, id, setMyDecks, setIsFetching, setError);
    }
  }, [token, id]);

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
        <UserProfileLayoutTitle
          title="Tous mes decks"
          buttonText="Créer un deck"
          buttonUrl={URL_FRONT_MY_DECK_ADD}
          buttonClassName="bg-blue-500 hover:bg-blue-600"
        />
        {error && (
          <p className="text-red-600 bg-red-50 rounded-lg p-2 mb-2" role="alert">
            {error}
          </p>
        )}
        {isFetching ? (
          <MyDecksDivSkeleton itemCount={8} />
        ) : (
          <div className={`grid gap-2 ${myDecks.length > 0 ? "grid-cols-12" : ""}`}>
            {myDecks.length > 0 ? (
              myDecks
                .filter((deck): deck is DeckWithArchetypeDetails & { id: string } => deck.id != null && deck.id !== "")
                .map((deck) => (
                  <Link
                    key={deck.id}
                    className="p-4 space-y-2 bg-white cardShadow rounded-lg col-span-6 lscreen:col-span-2"
                    to={getMyDeckUpdatePath(deck.id)}
                  >
                    <div className="rounded-md">
                      <img className="rounded-md" src={deck.archetype.card_img_url} alt={deck.archetype.label} />
                    </div>
                    <p className="flex justify-between items-center">
                      <span className="font-bold line-clamp-1">{deck.label}</span>
                      <span className={`text-white text-sm p-1 rounded-sm ${deck.is_playable === true ? "bg-green-500" : "bg-red-500"}`}>{deck.is_playable ? "Jouable" : "Non jouable"}</span>
                    </p>
                  </Link>
                ))
            ) : (
              <NoItemMessage message="Vous n'avez aucun deck pour le moment" textPosition="left" />
            )}
          </div>
        )}
        <Link
          to={URL_FRONT_MY_DECK_ADD}
          className="block bg-blue-200 absolute right-0 p-5 shadow rounded-full sscreen:hidden"
          aria-label="Ajouter un deck"
        >
          <FaPlus />
        </Link>
      </div>
    </UserProfilLayout>
  );
};

export default MyDecksPage;
