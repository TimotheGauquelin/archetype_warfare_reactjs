import React, { useEffect, useState, useMemo, useCallback } from 'react'
import AdminStructure from '../adminLayout';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { Input } from '../../../components/generic/form/input/Input';
import { getBanlistById, updateBanlist } from '../../../services/banlist';
import { getBanlistReasons } from '../../../services/banlistReason';
import { getCardTypes } from '../../../services/cardtype';
import AdminBanlistAddCard, { type BanlistFormLike as AdminBanlistFormLike } from '../../../components/pages/admin/banlist/AdminBanlistAddCard';
import AdminListedCardsToolbar, {
    matchesListedCardFilters,
    type ListedCardStatusFilter,
} from '../../../components/pages/admin/banlist/AdminListedCardsToolbar';
import { getCardStatus } from '../../../services/cardStatus';
import BanlistCardComponent, { type BanlistCardLayout } from '../../../components/generic/BanlistCard';
import Button from '../../../components/generic/buttons/classicButton/Button';
import PopUp from '../../../components/generic/PopUp';
import usePopup from '../../../hooks/usePopup';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import { formatDateForInput } from '../../../utils/date/formatDateForInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import type { Banlist, BanlistCard, BanlistReason } from '../../../types';
import {
    isGenericRestrictedBanlistCard,
    isUnlimitedBanlistStatus,
} from '../../../utils/banlist/genericBanlistCard';

interface CardType { id: number; label: string; num_order?: number;[key: string]: unknown }
interface CardStatus { id: number; label: string;[key: string]: unknown }

const AdminUpdateBanlist = () => {
    const [banlist, setBanlist] = useState<Banlist | AdminBanlistFormLike>({
        label: "",
        release_date: new Date().toISOString().split('T')[0],
        description: "",
        is_active: false,
        banlist_archetype_cards: [],
    });

    const [cardTypes, setCardTypes] = useState<CardType[]>([]);
    const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
    const [availableReasons, setAvailableReasons] = useState<BanlistReason[]>([]);
    const [cardsSearch, setCardsSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ListedCardStatusFilter>("all");
    const [viewMode, setViewMode] = useState<BanlistCardLayout>("grid");
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { token } = useSelector((state: RootState) => state.user);
    const { banlistId } = useParams<{ banlistId?: string }>();
    const navigate = useNavigate();
    const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

    const loadBanlistData = useCallback(async () => {
        if (!banlistId) return;

        setIsFetching(true);
        setError(null);
        setHasLoaded(false);

        try {
            await Promise.all([
                getBanlistById(banlistId, (v) => setBanlist(prev => {
                    const next = typeof v === 'function'
                        ? (v as (p: Banlist | AdminBanlistFormLike) => Banlist | AdminBanlistFormLike)(prev)
                        : v;
                    return {
                        ...next,
                        // Règle métier : génériques = uniquement Forbidden / Limited / Semi-Limited
                        banlist_archetype_cards: (next.banlist_archetype_cards || []).filter(
                            isGenericRestrictedBanlistCard
                        ),
                    };
                })),
                getCardTypes((v) => setCardTypes(prev => typeof v === 'function' ? (v as (p: CardType[]) => CardType[])(prev) : v)),
                getCardStatus((v) => setCardStatus(prev => typeof v === 'function' ? (v as (p: CardStatus[]) => CardStatus[])(prev) : v)),
                getBanlistReasons(setAvailableReasons),
            ]);
            setHasLoaded(true);
        } catch (err) {
            setError("Erreur lors du chargement de la banlist");
            console.error("Erreur:", err);
        } finally {
            setIsFetching(false);
        }
    }, [banlistId]);

    const sortedCards = useMemo(() => {
        if (!banlist?.banlist_archetype_cards || !cardTypes.length) return [];
        return [...banlist.banlist_archetype_cards].sort((a, b) => {
            const cardTypeA = cardTypes.find(
                (type) => type.label === a.card?.card_type
            );
            const cardTypeB = cardTypes.find(
                (type) => type.label === b.card?.card_type
            );

            if (cardTypeA && cardTypeB && cardTypeA.num_order != null && cardTypeB.num_order != null) {
                const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
                if (typeComparison !== 0) return typeComparison;

                const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
                if (atkComparison !== 0) return atkComparison;

                return (b.card.level || 0) - (a.card.level || 0);
            }

            return 0;
        });
    }, [banlist?.banlist_archetype_cards, cardTypes]);

    const genericCards = useMemo(() => {
        return sortedCards.filter(isGenericRestrictedBanlistCard);
    }, [sortedCards]);

    const filteredGenericCards = useMemo(() => {
        return genericCards.filter((card) =>
            matchesListedCardFilters(
                card.card?.name,
                card.card_status?.label,
                cardsSearch,
                statusFilter
            )
        );
    }, [genericCards, cardsSearch, statusFilter]);

    const sameCardId = (left: unknown, right: unknown) =>
        String(left ?? "") === String(right ?? "");

    const updateCardStatus = useCallback((cardId: string | number, statusId: string) => {
        const statusIdNumber = parseInt(statusId, 10);
        const selectedStatus = cardStatus.find((status) => status.id === statusIdNumber);

        // Unlimited sur une générique = plus de ligne banlist (locale jusqu'à enregistrement)
        if (isUnlimitedBanlistStatus(selectedStatus?.label)) {
            setBanlist((prevBanlist) => ({
                ...prevBanlist,
                banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).filter(
                    (banlistCard: BanlistCard) => !sameCardId(banlistCard.card.id, cardId)
                ),
            }));
            return;
        }

        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).map((banlistCard: BanlistCard) =>
                sameCardId(banlistCard.card.id, cardId)
                    ? {
                        ...banlistCard,
                        card_status_id: statusIdNumber,
                        card_status: {
                            ...banlistCard.card_status,
                            id: statusIdNumber,
                            label: selectedStatus?.label || banlistCard.card_status?.label,
                        }
                    }
                    : banlistCard
            )
        }));
    }, [cardStatus]);

    const updateCardReasons = useCallback((cardId: string | number, reasonIds: number[]) => {
        const selectedReasons = availableReasons.filter((r) => reasonIds.includes(r.id));
        setBanlist((prevBanlist) => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).map(
                (banlistCard: BanlistCard) =>
                    sameCardId(banlistCard.card.id, cardId)
                        ? {
                              ...banlistCard,
                              reason_ids: reasonIds,
                              reasons: selectedReasons,
                              explanation_text:
                                  selectedReasons.map((r) => r.label).join(" · ") || null,
                          }
                        : banlistCard
            ),
        }));
    }, [availableReasons]);

    const deleteCard = useCallback((cardId: string | number) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).filter(
                (card: BanlistCard) => !sameCardId(card.card.id, cardId)
            )
        }));
    }, []);

    const deleteAllListedCards = useCallback(() => {
        const visibleIds = new Set(genericCards.map((card) => card.card?.id));
        setBanlist((prevBanlist) => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).filter(
                (card: BanlistCard) => !visibleIds.has(card.card?.id)
            ),
        }));
    }, [genericCards]);

    const handleDeleteAllListedCards = useCallback(() => {
        if (genericCards.length === 0) return;
        showConfirmDialog({
            title: "Supprimer toutes les cartes",
            message: `Supprimer les ${genericCards.length} carte(s) listée(s) de cette banlist ?`,
            confirmText: "Supprimer",
            cancelText: "Annuler",
            onConfirm: deleteAllListedCards,
        });
    }, [genericCards.length, deleteAllListedCards, showConfirmDialog]);

    const handleUpdateBanlist = useCallback(() => {
        if (!banlistId || !token || !hasLoaded) return;
        setIsLoading(true);

        // Ne persister que les génériques restreintes ; le backend supprimera les Unlimited orphelines
        const mappedBanlistArchetypeCards = (banlist.banlist_archetype_cards || [])
            .filter(isGenericRestrictedBanlistCard)
            .map((card: BanlistCard) => {
            const cardId = card?.card?.id;
            const rawCardStatusId = (card as unknown as { card_status_id?: string | number | null })?.card_status_id ?? card?.card_status?.id;
            const cardStatusIdNumber = typeof rawCardStatusId === "string" ? parseInt(rawCardStatusId, 10) : Number(rawCardStatusId);

            const reasonIds =
                card.reason_ids ??
                (card.reasons ?? []).map((r) => r.id);

            return {
                card_id: String(cardId),
                card_status_id: cardStatusIdNumber,
                explanation_text: card.explanation_text ?? null,
                reason_ids: reasonIds,
                archetype_id: null,
                id: (card as unknown as { id?: number }).id,
            };
        });

        const updatedBanlist = {
            ...banlist,
            banlist_archetype_cards: mappedBanlistArchetypeCards,
        };

        laborIllusion(() => updateBanlist(
            token,
            banlistId,
            updatedBanlist as unknown as Partial<Banlist>,
            navigate,
            setIsLoading
        ), 1);
    }, [banlist, banlistId, hasLoaded, navigate, token]);

    useEffect(() => {
        loadBanlistData();
    }, [loadBanlistData]);

    if (isFetching) {
        return (
            <AdminStructure>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-lg">Chargement de la banlist...</div>
                </div>
            </AdminStructure>
        );
    }

    if (error || !hasLoaded) {
        return (
            <AdminStructure>
                <AdminBodyHeader
                    label="Modifier une banlist"
                    catchphrase="Gérez les cartes et leurs statuts"
                    returnButton
                />
                <div className="bg-red-100 border border-red-300 text-red-800 rounded p-4">
                    {error || "Impossible de charger la banlist. La sauvegarde est bloquée pour éviter d'écraser les données."}
                </div>
            </AdminStructure>
        );
    }

    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Modifier une banlist"
                catchphrase="Gérez les cartes et leurs statuts"
                returnButton
            />

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4 space-y-4">
                <div className="bg-gray-100 rounded p-3 space-y-3">
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="font-semibold text-lg text-gray-900">
                            Informations Principales
                        </h2>
                        <div className="flex justify-center items-center">
                            <SwitchInput
                                label="En ligne"
                                attribute="is_active"
                                data={banlist}
                                setAction={setBanlist}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <Input
                            label="Nom"
                            required
                            inputType="text"
                            attribute="label"
                            colSpanWidth="6"
                            data={banlist}
                            setAction={setBanlist}
                        />

                        <Input
                            label="Date de sortie"
                            required
                            inputType="date"
                            attribute="release_date"
                            colSpanWidth="6"
                            data={{
                                ...banlist,
                                release_date: formatDateForInput(banlist?.release_date as string | undefined)
                            }}
                            setAction={setBanlist as unknown as React.Dispatch<React.SetStateAction<{ release_date: string } & Record<string, unknown>>>}
                        />
                    </div>

                    <Input
                        label="Description"
                        required
                        inputType="text"
                        attribute="description"
                        data={banlist}
                        setAction={setBanlist}
                    />
                </div>

                <div className="bg-gray-100 rounded p-3 space-y-3">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="font-semibold text-lg text-gray-900">
                            Cartes génériques de la banlist
                        </h2>
                        <p className="text-sm text-gray-500">
                            {genericCards.length} carte{genericCards.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="grid grid-cols-12 gap-3 tablet:gap-4 items-start">
                        <div className="col-span-12 sscreen:col-span-7 lscreen:col-span-8 order-2 sscreen:order-1">
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <AdminListedCardsToolbar
                                    search={cardsSearch}
                                    onSearchChange={setCardsSearch}
                                    statusFilter={statusFilter}
                                    onStatusFilterChange={setStatusFilter}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    onDeleteAll={handleDeleteAllListedCards}
                                    deleteAllDisabled={genericCards.length === 0}
                                    searchAriaLabel="Rechercher une carte dans la banlist"
                                />
                                <div
                                    className="overflow-y-auto p-2 tablet:p-3"
                                    style={{ maxHeight: "640px" }}
                                >
                                    {genericCards.length > 0 ? (
                                        filteredGenericCards.length > 0 ? (
                                            <div
                                                className={
                                                    viewMode === "grid"
                                                        ? "grid grid-cols-1 tablet:grid-cols-2 lscreen:grid-cols-3 gap-2"
                                                        : "flex flex-col gap-1.5"
                                                }
                                            >
                                                {filteredGenericCards.map((card, index) => (
                                                    <BanlistCardComponent
                                                        key={`${card.card?.id}-${index}`}
                                                        card={card}
                                                        cardStatus={cardStatus}
                                                        availableReasons={availableReasons}
                                                        deleteCard={deleteCard}
                                                        updateCardStatus={updateCardStatus}
                                                        updateCardReasons={updateCardReasons}
                                                        layout={viewMode}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex min-h-[160px] items-center justify-center text-center text-gray-500 px-4">
                                                Aucune carte ne correspond aux filtres.
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex min-h-[220px] items-center justify-center text-center text-gray-500 px-4">
                                            Aucune carte. Ajoute-en depuis le panneau de droite.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 sscreen:col-span-5 lscreen:col-span-4 order-1 sscreen:order-2 sscreen:sticky sscreen:top-4">
                            <AdminBanlistAddCard
                                banlist={banlist}
                                setBanlist={setBanlist as React.Dispatch<React.SetStateAction<AdminBanlistFormLike>>}
                            />
                        </div>
                    </div>
                </div>

            <Button
                className="text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
                buttonText="Modifier la banlist"
                action={handleUpdateBanlist}
                disabled={isLoading}
                loadingText="Modification en cours..."
            />
            </div>

            <PopUp
                isOpen={isOpen}
                onClose={closePopup}
                title={popupConfig.title}
                className={popupConfig.className}
                showCloseButton={popupConfig.showCloseButton}
                closeOnBackdropClick={popupConfig.closeOnBackdropClick}
            >
                {popupConfig.content}
            </PopUp>

        </AdminStructure>
    );
}

export default AdminUpdateBanlist;