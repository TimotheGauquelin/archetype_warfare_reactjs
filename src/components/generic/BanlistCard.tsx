import { useCallback, useMemo, useState } from "react";
import { cardStatusToFrench } from "@/utils/trad/cardStatus";
import { FaTrashAlt } from "react-icons/fa";
import type { BanlistCard as BanlistCardType, BanlistReason, Card as CardType } from "../../types";
import { STATUS_UNLIMITED } from "@/utils/const/banlistConst";
import TagAutocompleteInput from "./form/TagAutocompleteInput";
import { useLongPress } from "@/hooks/useLongPress";
import DeckCardDetailPopUp from "@/components/pages/userProfil/deckCommon/DeckCardDetailPopUp";

interface CardStatusOption {
    id: number;
    label: string;
    [key: string]: unknown;
}

export type BanlistCardId = string | number;
export type BanlistCardLayout = "grid" | "list";

interface BanlistCardProps {
    card: BanlistCardType;
    cardStatus: CardStatusOption[];
    availableReasons: BanlistReason[];
    updateCardStatus: (cardId: BanlistCardId, statusId: string) => void;
    updateCardReasons: (cardId: BanlistCardId, reasonIds: number[]) => void;
    deleteCard: (cardId: BanlistCardId) => void;
    canBeUnlimited?: boolean;
    layout?: BanlistCardLayout;
}

const BanlistCard = ({
    card,
    cardStatus,
    availableReasons,
    updateCardStatus,
    updateCardReasons,
    deleteCard,
    canBeUnlimited = false,
    layout = "grid",
}: BanlistCardProps) => {
    const cardId = card?.card?.id as BanlistCardId;
    const [detailCard, setDetailCard] = useState<CardType | null>(null);
    const [detailReasons, setDetailReasons] = useState<BanlistReason[]>([]);
    const normalizedUnlimited = STATUS_UNLIMITED.toLocaleLowerCase();
    const visibleCardStatuses = canBeUnlimited
        ? cardStatus
        : cardStatus.filter(
              (status) => status.label?.toLocaleLowerCase() !== normalizedUnlimited
          );

    const currentStatusLabel =
        card.card_status?.label ??
        cardStatus.find((s) => Number(s.id) === Number(card.card_status?.id))?.label ??
        "";
    const isUnlimited =
        currentStatusLabel.toLocaleLowerCase() === normalizedUnlimited;

    const selectedReasonIds = useMemo(() => {
        if (card.reason_ids?.length) {
            return card.reason_ids.map(Number);
        }
        return (card.reasons ?? []).map((r) => Number(r.id));
    }, [card.reason_ids, card.reasons]);

    const reasonOptions = useMemo(
        () =>
            availableReasons.map((reason) => ({
                value: reason.id,
                label: reason.label,
                description: reason.text,
            })),
        [availableReasons]
    );

    const openDetails = useCallback(() => {
        if (!card?.card) return;
        const currentReasons =
            card.reasons?.length
                ? card.reasons
                : availableReasons.filter((r) =>
                      (card.reason_ids ?? []).map(Number).includes(r.id)
                  );
        setDetailReasons(currentReasons);
        setDetailCard({
            ...card.card,
            card_status: card.card_status,
        } as CardType);
    }, [availableReasons, card.card, card.card_status, card.reason_ids, card.reasons]);

    const { handlers, wasLongPress } = useLongPress(openDetails);

    const handleStatusChange = (statusId: string) => {
        const selected = cardStatus.find((s) => Number(s.id) === Number(statusId));
        const nextIsUnlimited =
            selected?.label?.toLocaleLowerCase() === normalizedUnlimited;

        if (nextIsUnlimited && selectedReasonIds.length > 0) {
            updateCardReasons(cardId, []);
        }
        updateCardStatus(cardId, statusId);
    };

    const statusSelect = (
        <select
            value={card.card_status?.id ?? ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label="Statut"
            className={`text-xs py-1 px-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                layout === "list" ? "w-[130px] shrink-0" : "w-full"
            }`}
        >
            {visibleCardStatuses.map((status) => (
                <option key={status.id} value={Number(status.id)}>
                    {cardStatusToFrench(status.label)}
                </option>
            ))}
        </select>
    );

    const reasonsField = !isUnlimited && (
        <TagAutocompleteInput
            compact
            options={reasonOptions}
            selectedValues={selectedReasonIds}
            onChange={(values) =>
                updateCardReasons(
                    cardId,
                    values.map((v) => Number(v)).filter((id) => !Number.isNaN(id))
                )
            }
            placeholder="Ajouter une raison…"
        />
    )

    const deleteButton = (
        <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shrink-0"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteCard(cardId);
            }}
            title="Retirer cette carte (effectif à l'enregistrement)"
            type="button"
        >
            <FaTrashAlt size={10} />
        </button>
    );

    const cardImage = (
        <div
            className="shrink-0 select-none touch-manipulation cursor-pointer"
            title="Maintenir pour voir les infos de la carte"
            {...handlers}
            onClick={(e) => {
                e.preventDefault();
                wasLongPress();
            }}
        >
            <img
                className={`object-cover rounded pointer-events-none ${
                    layout === "list" ? "w-10 h-[58px]" : "w-14 h-[82px]"
                }`}
                src={card?.card?.img_url}
                alt={card?.card?.name}
                draggable={false}
            />
        </div>
    );

    return (
        <>
            {layout === "list" ? (
                <div className="flex items-start gap-2 bg-slate-50 rounded-md p-1.5 border border-gray-200">
                    {cardImage}
                    <p className="w-[140px] tablet:w-[180px] shrink-0 text-xs font-semibold text-gray-900 leading-tight line-clamp-2 pt-0.5">
                        {card?.card?.name || "Carte"}
                    </p>
                    {statusSelect}
                    <div className="min-w-0 flex-1">{reasonsField}</div>
                    {deleteButton}
                </div>
            ) : (
                <div className="relative flex gap-2 bg-slate-50 rounded-md p-2 border border-gray-200">
                    {cardImage}

                    <div className="min-w-0 flex-1 space-y-1.5 pr-6">
                        <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-1">
                            {card?.card?.name || "Carte"}
                        </p>
                        {statusSelect}
                        {reasonsField}
                    </div>

                    <div className="absolute top-1.5 right-1.5">{deleteButton}</div>
                </div>
            )}

            <DeckCardDetailPopUp
                card={detailCard}
                reasons={detailReasons}
                isOpen={detailCard != null}
                onClose={() => {
                    setDetailCard(null);
                    setDetailReasons([]);
                }}
            />
        </>
    );
};

export default BanlistCard;
