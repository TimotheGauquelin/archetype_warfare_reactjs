import { cardStatusToFrench } from "@/utils/trad/cardStatus";
import { FaTrashAlt } from "react-icons/fa";
import type { BanlistCard as BanlistCardType } from "../../types";
import { STATUS_UNLIMITED } from "@/utils/const/banlistConst";

interface CardStatusOption {
    id: number;
    label: string;
    [key: string]: unknown;
}

interface BanlistCardProps {
    card: BanlistCardType;
    cardStatus: CardStatusOption[];
    updateCardStatus: (cardId: number, statusId: string) => void;
    updateCardExplanation: (cardId: number, explanation: string) => void;
    deleteCard: (cardId: number) => void;
    canBeUnlimited?: boolean;
}

const BanlistCard = ({
    card,
    cardStatus,
    updateCardStatus,
    updateCardExplanation,
    deleteCard,
    canBeUnlimited = false,
}: BanlistCardProps) => {

    const normalizedUnlimited = STATUS_UNLIMITED.toLocaleLowerCase();
    const visibleCardStatuses = canBeUnlimited
        ? cardStatus
        : cardStatus.filter((status) => status.label?.toLocaleLowerCase() !== normalizedUnlimited);

    return (
        <div className="relative col-span-1 flex gap-2 bg-slate-50 rounded-lg p-3 border">
            <div className="w-[100px]">
                <img
                    className="w-full rounded-lg hover:saturate-150 transition-all duration-200"
                    src={card?.card?.img_url}
                    alt={card?.card?.name}
                />
            </div>

            <div className="space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                    </label>
                    <select
                        value={card.card_status?.id ?? ""}
                        onChange={(e) => updateCardStatus(card.card.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {visibleCardStatuses.map((status) => (
                                <option key={status.id} value={Number(status.id)}>
                                    {cardStatusToFrench(status.label)}
                                </option>
                            ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Explication
                    </label>
                    <textarea
                        value={card.explanation_text || ""}
                        onChange={(e) =>
                            updateCardExplanation(card.card.id, e.target.value)
                        }
                        placeholder="Explication du statut..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                    />
                </div>
            </div>
            <button
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                onClick={() => deleteCard(card?.card?.id as number)}
                title="Supprimer cette carte"
                type="button"
            >
                <FaTrashAlt size={12} />
            </button>
        </div>
    );
};

export default BanlistCard;