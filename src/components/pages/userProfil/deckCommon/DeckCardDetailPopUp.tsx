import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PopUp from "@/components/generic/PopUp";
import { getCardById, type CardDetailResponse } from "@/services/card";
import type { BanlistReason, Card, RootState } from "@/types";
import { attributeToFrench } from "@/utils/trad/attribute";
import { cardTypeToFrench } from "@/utils/trad/cardType";
import { cardStatusToFrench } from "@/utils/trad/cardStatus";
import { monsterTypeToFrench } from "@/utils/trad/monsterType";

type DeckCardDetailSource = Pick<
  Card,
  "id" | "name" | "img_url" | "type" | "card_type" | "level" | "atk" | "def" | "card_status"
> & {
  description?: string | null;
  attribute?: string | { id?: number; label?: string } | null;
  cardType?: { id?: number; label?: string };
  reasons?: BanlistReason[];
};

interface DeckCardDetailPopUpProps {
  card: DeckCardDetailSource | null;
  isOpen: boolean;
  onClose: () => void;
  reasons?: BanlistReason[] | null;
}

const attrLabel = (
  attribute: DeckCardDetailSource["attribute"]
): string | null => {
  if (attribute == null) return null;
  if (typeof attribute === "string") return attribute;
  return attribute.label ?? null;
};

const DeckCardDetailPopUp: React.FC<DeckCardDetailPopUpProps> = ({
  card,
  isOpen,
  onClose,
  reasons,
}) => {
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const [detail, setDetail] = useState<CardDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || card?.id == null) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCardById(String(card.id), locale === "en" ? "en" : "fr")
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, card?.id, locale]);

  if (!card) return null;

  const isFrench = locale !== "en";
  const name = detail?.name ?? card.name;
  const description =
    detail?.description ??
    (typeof card.description === "string" ? card.description : null);
  const img = detail?.img_url ?? card.img_url;
  const rawCardType =
    detail?.card_type ??
    card.card_type ??
    card.cardType?.label ??
    null;
  const rawMonsterType = detail?.type ?? card.type ?? null;
  const rawAttribute = detail?.attribute ?? attrLabel(card.attribute);
  const cardType = rawCardType
    ? isFrench
      ? cardTypeToFrench(rawCardType)
      : rawCardType
    : null;
  const monsterType = rawMonsterType
    ? isFrench
      ? monsterTypeToFrench(rawMonsterType)
      : rawMonsterType
    : null;
  const attribute = rawAttribute
    ? isFrench
      ? attributeToFrench(rawAttribute)
      : rawAttribute
    : null;
  const level = detail?.level ?? card.level;
  const atk = detail?.atk ?? card.atk;
  const def = detail?.def ?? card.def;
  const rawStatusLabel = card.card_status?.label;
  const statusLabel = rawStatusLabel
    ? isFrench
      ? cardStatusToFrench(rawStatusLabel)
      : rawStatusLabel
    : null;
  const statusLimit = card.card_status?.limit;
  const displayedReasons = reasons ?? card.reasons ?? [];

  return (
    <PopUp
      isOpen={isOpen}
      onClose={onClose}
      title={name || t("profile.cardDetails")}
      className="max-w-lg"
    >
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex flex-col lscreen:flex-row gap-4 lscreen:items-stretch">
          <div className="w-40 mx-auto lscreen:mx-0 shrink-0 aspect-[59/86]">
            <img
              src={img || `${import.meta.env.BASE_URL}assets/waiting_archetype_image.jpg`}
              alt={name || "Carte"}
              className="w-full h-full object-cover rounded shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `${import.meta.env.BASE_URL}assets/waiting_archetype_image.jpg`;
              }}
            />
          </div>
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto space-y-1.5 lscreen:max-h-[calc(10rem*86/59)]">
            {loading && (
              <p className="text-gray-400 italic">{t("common.loading")}</p>
            )}
            {cardType && (
              <p>
                <span className="font-semibold">{t("profile.cardType")} :</span>{" "}
                {cardType}
              </p>
            )}
            {monsterType && (
              <p>
                <span className="font-semibold">{t("profile.monsterType")} :</span>{" "}
                {monsterType}
              </p>
            )}
            {attribute && (
              <p>
                <span className="font-semibold">{t("profile.cardAttribute")} :</span>{" "}
                {attribute}
              </p>
            )}
            {level != null && (
              <p>
                <span className="font-semibold">{t("profile.cardLevel")} :</span>{" "}
                {level}
              </p>
            )}
            {(atk != null || def != null) && (
              <p>
                <span className="font-semibold">ATK / DEF :</span>{" "}
                {atk ?? "—"} / {def ?? "—"}
              </p>
            )}
            {statusLabel && (
              <p>
                <span className="font-semibold">{t("profile.cardBanlistStatus")} :</span>{" "}
                {statusLabel}
                {statusLimit != null ? ` (${statusLimit})` : ""}
              </p>
            )}
            {displayedReasons.length > 0 ? (
              <div className="pt-0.5">
                <p className="font-semibold mb-1">
                  {t("profile.cardBanlistReasons")} :
                </p>
                <ul className="space-y-1">
                  {displayedReasons.map((reason) => (
                    <li
                      key={reason.id}
                      className="flex items-start gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1"
                    >
                      {reason.logo_url ? (
                        <img
                          src={reason.logo_url}
                          alt=""
                          className="w-4 h-4 object-contain shrink-0 mt-0.5"
                        />
                      ) : null}
                      <span className="min-w-0">
                        <span className="font-semibold text-gray-900 block text-xs leading-tight">
                          {reason.label}
                        </span>
                        {reason.text ? (
                          <span className="text-gray-600 text-[11px] leading-snug block">
                            {reason.text}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-1">{t("profile.cardDescription")} :</p>
          <p className="whitespace-pre-wrap text-gray-600">
            {description?.trim()
              ? description
              : loading
                ? t("common.loading")
                : t("profile.noCardDescription")}
          </p>
        </div>
      </div>
    </PopUp>
  );
};

export default DeckCardDetailPopUp;
