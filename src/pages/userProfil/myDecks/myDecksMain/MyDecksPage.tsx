import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getMyDecks } from "../../../../services/deck";
import { URL_FRONT_MY_DECK_ADD, getMyDeckUpdatePath } from "../../../../constant/urlsFront";
import type { DeckWithArchetypeDetails, RootState } from "../../../../types";
import UserProfilLayout from "../../layout";
import NoItemMessage from "@/components/generic/NoItemMessage";
import MyDecksDivSkeleton from "@/components/skeletons/MyDecksDivSkeleton";
import { optimizeImageUrl } from "../../../../utils/image/optimizeImageUrl";
import ProfileSection from "@/components/pages/userProfil/ProfileSection";

const MyDecksPage = () => {
  const { t } = useTranslation();
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
      <ProfileSection
        title={t("profile.allMyDecks")}
        action={
          <Link
            to={URL_FRONT_MY_DECK_ADD}
            className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-2.5 py-1 rounded"
          >
            {t("profile.createDeck")}
          </Link>
        }
      >
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
                .map((deck) => {
                  const archetypeImg = deck.archetype?.card_img_url;
                  const isPlayable =
                    Boolean(deck.is_playable) && deck.archetype?.is_active === true;

                  return (
                    <Link
                      key={deck.id}
                      className="p-3 space-y-2 bg-slate-50 border border-slate-200 rounded-lg col-span-6 lscreen:col-span-2 hover:border-slate-400"
                      to={getMyDeckUpdatePath(deck.id)}
                    >
                      <div className="rounded-md aspect-square overflow-hidden bg-gray-300">
                        {archetypeImg ? (
                          <img
                            className="rounded-md w-full h-full object-cover"
                            src={optimizeImageUrl(archetypeImg, "card")}
                            alt={deck.archetype?.label || deck.label || t("profile.deckWithoutArchetype")}
                            width={400}
                            height={400}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div
                            className="w-full h-full bg-gray-300"
                            aria-label={t("profile.deckWithoutArchetype")}
                            role="img"
                          />
                        )}
                      </div>
                      <p className="flex flex-col justify-between items-center gap-1">
                        <span className="font-bold line-clamp-1 text-sm">{deck.label}</span>
                        <span
                          className={`text-white text-xs px-1.5 py-0.5 rounded-sm ${isPlayable ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {isPlayable ? t("profile.playable") : t("profile.notPlayable")}
                        </span>
                      </p>
                    </Link>
                  );
                })
            ) : (
              <NoItemMessage message={t("profile.noDecks")} textPosition="left" />
            )}
          </div>
        )}
      </ProfileSection>
    </UserProfilLayout>
  );
};

export default MyDecksPage;
