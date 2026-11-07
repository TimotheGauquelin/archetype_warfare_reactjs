import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cardStatusToFrench } from "../../utils/trad/cardStatus";
import type { Card as CardType, CardWithBanlistStatus } from "../../types";
import { optimizeImageUrl, type ImagePreset } from "../../utils/image/optimizeImageUrl";
import { useCachedImageSrc } from "../../utils/image/useCachedImageSrc";
import { useFetchPriorityHigh } from "../../utils/image/useFetchPriorityHigh";
import { useLongPress } from "@/hooks/useLongPress";
import DeckCardDetailPopUp from "@/components/pages/userProfil/deckCommon/DeckCardDetailPopUp";

interface CardProps {
  card: CardWithBanlistStatus;
  index?: number;
  /** Preset Cloudinary/YGOProDeck pour la grille. */
  imagePreset?: ImagePreset;
  /** Classes de grille (ex. col-span) — override le défaut 12-colonnes. */
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  index = 0,
  imagePreset = "card",
  className,
}) => {
  const { t } = useTranslation();
  const [cardPopUp, setCardPopUp] = useState(false);
  const [detailCard, setDetailCard] = useState<CardType | null>(null);
  const statusLabel = card.card_status?.label.toLowerCase() ?? "";
  const isUnlimited = statusLabel === "unlimited";
  const statusBorderClass =
    statusLabel === "forbidden"
      ? "border-4 border-red-500"
      : statusLabel === "limited"
        ? "border-4 border-orange-500"
        : statusLabel === "semi-limited"
          ? "border-4 border-yellow-400"
          : "";
  const isLcpCandidate = index === 0;
  const isAboveFold = index < 4;
  const fetchPriorityRef = useFetchPriorityHigh(isLcpCandidate);

  const optimizedSrc = useMemo(
    () => optimizeImageUrl(card.card.img_url, imagePreset),
    [card.card.img_url, imagePreset]
  );
  const imageSrc = useCachedImageSrc(optimizedSrc);

  const openDetails = useCallback(() => {
    setCardPopUp(false);
    setDetailCard({
      ...card.card,
      card_status: card.card_status,
      reasons: card.reasons,
    } as CardType & { reasons?: typeof card.reasons });
  }, [card.card, card.card_status, card.reasons]);

  const { handlers, wasLongPress } = useLongPress(openDetails);

  const rootClassName =
    className ??
    "relative lscreen:col-span-2 sscreen:col-span-3 col-span-6 cursor-pointer select-none touch-manipulation";

  return (
    <>
      <div
        className={`${rootClassName} group overflow-visible`}
        onMouseOver={!isUnlimited ? () => setCardPopUp(true) : undefined}
        onMouseOut={!isUnlimited ? () => setCardPopUp(false) : undefined}
        title={t("profile.longPressForDetails")}
        {...handlers}
        onClick={() => {
          wasLongPress();
        }}
      >
        {/* Padding haut/droite : l’icône dépasse l’image sans sortir de la cellule (évite le crop). */}
        <div className="relative z-0 overflow-visible pt-2.5 pr-2.5 transition-transform duration-200 ease-out group-hover:z-10 group-hover:scale-[1.04]">
          <div
            className={`relative border-text aspect-[59/86] w-full bg-gray-200 rounded-sm overflow-hidden ${statusBorderClass}`}
          >
            <img
              ref={fetchPriorityRef}
              src={imageSrc}
              alt={card?.card.name}
              width={420}
              height={614}
              loading={isAboveFold ? "eager" : "lazy"}
              decoding={isLcpCandidate ? "sync" : "async"}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
              style={{ boxShadow: "rgba(0, 0, 0, 0.75) 1.95px 1.95px 2.6px" }}
            />
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
                    Pourquoi cette carte est{" "}
                    {cardStatusToFrench(card.card_status.label).toLowerCase()} :
                  </p>
                  {card.reasons && card.reasons.length > 0 ? (
                    <ul className="space-y-2">
                      {card.reasons.map((reason) => (
                        <li key={reason.id} className="flex items-start gap-2">
                          {reason.logo_url ? (
                            <img
                              src={reason.logo_url}
                              alt=""
                              className="w-5 h-5 object-contain shrink-0 mt-0.5"
                            />
                          ) : null}
                          <span>
                            <span className="font-semibold text-white">
                              {reason.label}
                            </span>
                            {reason.text ? (
                              <span className="block text-gray-300">
                                {reason.text}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-200">{card.explanation_text || ""}</p>
                  )}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900" />
              </div>
            )}
          </div>
          {card.card_status && (
            <img
              className="absolute z-20 pointer-events-none top-0 right-0 w-6 h-6 tablet:w-8 tablet:h-8 drop-shadow-md"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              src={
                import.meta.env.BASE_URL +
                `assets/banlistCardStatusIcon/${card.card_status.label.toLowerCase()}.png`
              }
              alt=""
            />
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
