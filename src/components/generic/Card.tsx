import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cardStatusToFrench } from "../../utils/trad/cardStatus";
import type { Card as CardType, CardWithBanlistStatus } from "../../types";
import { optimizeImageUrl } from "../../utils/image/optimizeImageUrl";
import { useFetchPriorityHigh } from "../../utils/image/useFetchPriorityHigh";
import { useLongPress } from "@/hooks/useLongPress";
import DeckCardDetailPopUp from "@/components/pages/userProfil/deckCommon/DeckCardDetailPopUp";

interface CardProps {
  card: CardWithBanlistStatus;
  index?: number;
}

const Card: React.FC<CardProps> = ({ card, index = 0 }) => {
  const { t } = useTranslation();
  const [cardPopUp, setCardPopUp] = useState(false);
  const [detailCard, setDetailCard] = useState<CardType | null>(null);
  const isUnlimited = card.card_status?.label.toLowerCase() === "unlimited";
  const isLcpCandidate = index === 0;
  const isAboveFold = index < 4;
  const fetchPriorityRef = useFetchPriorityHigh(isLcpCandidate);

  const imageSrc = useMemo(
    () => optimizeImageUrl(card.card.img_url, "card"),
    [card.card.img_url]
  );

  const openDetails = useCallback(() => {
    setCardPopUp(false);
    setDetailCard({
      ...card.card,
      card_status: card.card_status,
    });
  }, [card.card, card.card_status]);

  const { handlers, wasLongPress } = useLongPress(openDetails);

  return (
    <>
      <div
        className="relative lscreen:col-span-2 sscreen:col-span-3 col-span-6 cursor-pointer select-none touch-manipulation"
        onMouseOver={!isUnlimited ? () => setCardPopUp(true) : undefined}
        onMouseOut={!isUnlimited ? () => setCardPopUp(false) : undefined}
        title={t("profile.longPressForDetails")}
        {...handlers}
        onClick={() => {
          // Empêche un éventuel handler parent ; le détail s'ouvre uniquement au long-press.
          wasLongPress();
        }}
      >
        {/* Place réservée avant chargement → CLS */}
        <div className="relative border-text aspect-[59/86] w-full bg-gray-200 rounded-sm overflow-hidden">
          <img
            ref={fetchPriorityRef}
            src={imageSrc}
            alt={card?.card.name}
            width={280}
            height={410}
            loading={isAboveFold ? "eager" : "lazy"}
            decoding={isLcpCandidate ? "sync" : "async"}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
            style={{ boxShadow: "rgba(0, 0, 0, 0.75) 1.95px 1.95px 2.6px" }}
          />
          {card.card_status && (
            <img
              className="absolute z-10 pointer-events-none top-1 right-1 w-5 h-5 tablet:w-[30px] tablet:h-[30px]"
              width={30}
              height={30}
              loading="lazy"
              decoding="async"
              src={
                import.meta.env.BASE_URL +
                `assets/banlistCardStatusIcon/${card.card_status.label.toLowerCase()}.png`
              }
              alt=""
            />
          )}
          {cardPopUp && !isUnlimited && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-max max-w-[400px] animate-fadeIn pointer-events-none">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                {card?.archetype?.name && (
                  <p className="mb-1">
                    <span className="text-red-400 font-bold">Archetype : </span>
                    {card.archetype.name}
                  </p>
                )}
                <p className="text-red-400 font-bold mb-1">
                  Pourquoi cette carte est {cardStatusToFrench(card.card_status.label).toLowerCase()} :
                </p>
                <p className="text-gray-200">{card.explanation_text || ""}</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900" />
            </div>
          )}
        </div>
      </div>
      <DeckCardDetailPopUp
        card={detailCard}
        isOpen={detailCard != null}
        onClose={() => setDetailCard(null)}
      />
    </>
  );
};

export default Card;
