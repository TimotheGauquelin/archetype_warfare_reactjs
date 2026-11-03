import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { searchCards } from '../../../../services/card';
import type { Banlist, Card, Pagination, BanlistCard, RootState } from '../../../../types';
import { STATUS_FORBIDDEN } from '../../../../utils/const/banlistConst';
import { isGenericRestrictedBanlistCard } from '../../../../utils/banlist/genericBanlistCard';

export type BanlistFormLike = { banlist_archetype_cards?: BanlistCard[] } & Record<string, unknown>;

interface AdminBanlistAddCardProps {
  banlist: Banlist | BanlistFormLike;
  setBanlist: React.Dispatch<React.SetStateAction<Banlist | BanlistFormLike>>;
}

const AdminBanlistAddCard: React.FC<AdminBanlistAddCardProps> = ({ banlist, setBanlist }) => {

    const [cards, setCards] = useState<Card[]>([]);
    const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 30,
    });

    const [filters, setFilters] = useState<{ name: string; page: number; size: number }>({
        name: "",
        page: 1,
        size: 30,
    });

    const increasePage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setFilters(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
    };

    const decreasePage = () => {
        if (pagination.currentPage > 1) {
            setFilters(prev => ({
                ...prev,
                page: prev.page - 1
            }));
        }
    };

    const findExistingEntry = (cardId: number | string) =>
        banlist?.banlist_archetype_cards?.find(
            (banlistCard) => banlistCard?.card?.id === cardId
        );

    const isAlreadyListedAsGenericRestricted = (cardId: number | string) => {
        const existing = findExistingEntry(cardId);
        return existing ? isGenericRestrictedBanlistCard(existing) : false;
    };

    const belongsToArchetype = (card: Card) => Boolean(card.is_archetype_card);

    const addCardToBanlist = (card: Card) => {
        if (belongsToArchetype(card)) {
            return;
        }

        const existing = findExistingEntry(card.id);

        // Déjà listée comme générique restreinte → ne rien faire
        if (existing && isGenericRestrictedBanlistCard(existing)) {
            return;
        }

        // Existe mais masquée (Unlimited / autre) → réactiver en Forbidden générique
        if (existing) {
            setBanlist((prevState): Banlist | BanlistFormLike => {
                const nextCards = (prevState.banlist_archetype_cards || []).map((banlistCard) => {
                    if (banlistCard?.card?.id !== card.id) {
                        return banlistCard;
                    }
                    const { archetype_id: _ignored, ...cardWithoutArchetype } = {
                        ...banlistCard.card,
                        ...card,
                    };
                    return {
                        ...banlistCard,
                        archetype_id: null,
                        card_status_id: 1,
                        card_status: {
                            id: 1,
                            label: STATUS_FORBIDDEN,
                        },
                        explanation_text: banlistCard.explanation_text || null,
                        reasons: banlistCard.reasons ?? [],
                        reason_ids: banlistCard.reason_ids ?? [],
                        card: cardWithoutArchetype,
                    } as unknown as BanlistCard;
                });
                return {
                    ...prevState,
                    banlist_archetype_cards: nextCards,
                };
            });
            return;
        }

        const { archetype_id: _ignored, ...cardWithoutArchetype } = card;
        const newCard = {
            id: Date.now(),
            card_status_id: 1,
            explanation_text: null,
            reasons: [],
            reason_ids: [],
            card: cardWithoutArchetype,
            card_status: {
                id: 1,
                label: STATUS_FORBIDDEN,
            },
            archetype_id: null,
            card_id: card.id,
        } as unknown as BanlistCard;

        setBanlist((prevState): Banlist | BanlistFormLike => ({
            ...prevState,
            banlist_archetype_cards: [...(prevState.banlist_archetype_cards || []), newCard],
        }));
    };


    useEffect(() => {
        searchCards(setCards, setPagination, filters.size, filters.page, filters.name);
    }, [filters, locale]);

    return (
        <div className="w-full">
            <div className="bg-slate-700 p-2.5 tablet:p-3 rounded-lg space-y-2">
                <h3 className="text-sm font-semibold text-white">Ajouter des cartes</h3>
                <input
                    className="w-full p-2 rounded border border-slate-500 bg-white text-sm"
                    value={filters.name}
                    type="text"
                    placeholder="Quelle carte recherchez-vous ?"
                    onChange={(e) => {
                        setFilters((prev) => ({
                            ...prev,
                            name: e.target.value,
                            page: 1,
                        }));
                    }}
                />
                <div
                    className="overflow-y-auto bg-white grid grid-cols-12 gap-1 p-1 rounded"
                    style={{ maxHeight: "420px" }}
                >
                    {cards?.map((card, index) => {
                        const alreadyListed = isAlreadyListedAsGenericRestricted(card.id);
                        const isArchetypeCard = belongsToArchetype(card);
                        const isDisabled = alreadyListed || isArchetypeCard;

                        return (
                            <div className="col-span-4 tablet:col-span-3 relative" key={index}>
                                <img
                                    className={
                                        isDisabled
                                            ? "opacity-40 cursor-not-allowed w-full"
                                            : "hover:saturate-150 cursor-pointer w-full"
                                    }
                                    src={`${card?.img_url}`}
                                    alt=""
                                    loading="lazy"
                                    onClick={() => !isDisabled && addCardToBanlist(card)}
                                />
                                {alreadyListed && (
                                    <p
                                        style={{ fontSize: "8px", padding: "2px" }}
                                        className="absolute top-1/2 left-0 -translate-y-1/2 text-center w-full bg-yellow-500 text-white rounded"
                                    >
                                        Déjà ajoutée
                                    </p>
                                )}
                                {!alreadyListed && isArchetypeCard && (
                                    <p
                                        style={{ fontSize: "8px", padding: "2px" }}
                                        className="absolute top-1/2 left-0 -translate-y-1/2 text-center w-full bg-slate-600 text-white rounded"
                                    >
                                        Archétype
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-around items-center text-white">
                    <FaAngleLeft
                        className={`h-8 cursor-pointer ${pagination.currentPage <= 1 && "invisible"}`}
                        onClick={() => decreasePage()}
                    />
                    <p className="text-sm">
                        {pagination.currentPage} / {Math.max(pagination.totalPages, 1)}
                    </p>
                    <FaAngleRight
                        className={`h-8 cursor-pointer ${
                            pagination.currentPage >= pagination.totalPages && "invisible"
                        }`}
                        onClick={() => {
                            increasePage();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminBanlistAddCard;
