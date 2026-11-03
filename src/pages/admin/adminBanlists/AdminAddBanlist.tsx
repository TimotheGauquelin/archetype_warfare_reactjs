import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AdminStructure from '../adminLayout';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { Input } from '../../../components/generic/form/input/Input';
import AdminBanlistAddCard, { type BanlistFormLike as AdminBanlistFormLike } from '../../../components/pages/admin/banlist/AdminBanlistAddCard';
import AdminListedCardsToolbar, {
    matchesListedCardFilters,
    type ListedCardStatusFilter,
} from '../../../components/pages/admin/banlist/AdminListedCardsToolbar';
import BanlistCardComponent, { type BanlistCardLayout } from '../../../components/generic/BanlistCard';
import Button from '../../../components/generic/buttons/classicButton/Button';
import { getCardStatus } from '../../../services/cardStatus';
import { getBanlistReasons } from '../../../services/banlistReason';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import { addBanlist } from '../../../services/banlist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateForInput } from '../../../utils/date/formatDateForInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import type { Banlist, BanlistCard, BanlistReason } from '../../../types';
import {
    isGenericRestrictedBanlistCard,
    isUnlimitedBanlistStatus,
} from '../../../utils/banlist/genericBanlistCard';

interface CardStatus {
  id: number;
  label: string;
  [key: string]: unknown;
}

type NewBanlistForm = {
  label: string;
  release_date: string;
  description: string;
  is_active: boolean;
  banlist_archetype_cards: BanlistCard[];
} & Record<string, unknown>;

const AdminAddBanlist = () => {

    const navigate = useNavigate();

    const [banlist, setBanlist] = useState<NewBanlistForm>({
        label: "",
        release_date: new Date().toISOString().split('T')[0],
        description: "",
        is_active: false,
        banlist_archetype_cards: [],
    });
    const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
    const [availableReasons, setAvailableReasons] = useState<BanlistReason[]>([]);
    const [cardsSearch, setCardsSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ListedCardStatusFilter>("all");
    const [viewMode, setViewMode] = useState<BanlistCardLayout>("grid");
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useSelector((state: RootState) => state.user);

    const filteredCards = useMemo(() => {
        return banlist.banlist_archetype_cards.filter((card) =>
            matchesListedCardFilters(
                card.card?.name,
                card.card_status?.label,
                cardsSearch,
                statusFilter
            )
        );
    }, [banlist.banlist_archetype_cards, cardsSearch, statusFilter]);

    const handleAddBanlist = useCallback(() => {
        if (!token) return;
        // Le back attend un tableau DTO "plat" (pas de `card`, pas de `card_status` imbriqués).
        const mappedBanlistArchetypeCards = (banlist.banlist_archetype_cards || [])
            .filter(isGenericRestrictedBanlistCard)
            .map((item: BanlistCard) => {
            const cardId = (item as unknown as { card_id?: string | number | null }).card_id ?? item?.card?.id;
            const rawCardStatusId =
                (item as unknown as { card_status_id?: string | number | null }).card_status_id ?? item?.card_status?.id;

            const cardStatusIdNumber =
                typeof rawCardStatusId === "string" ? parseInt(rawCardStatusId, 10) : Number(rawCardStatusId);

            const reasonIds =
                item.reason_ids ??
                (item.reasons ?? []).map((r) => r.id);

            return {
                card_id: String(cardId),
                card_status_id: cardStatusIdNumber,
                explanation_text: item.explanation_text ?? null,
                reason_ids: reasonIds,
                archetype_id: null,
                id: (item as unknown as { id?: number }).id,
            };
        });

        const payload = {
            ...banlist,
            banlist_archetype_cards: mappedBanlistArchetypeCards,
        };

        setIsLoading(true);
        laborIllusion(() => addBanlist(
            token,
            payload as unknown as Partial<Banlist>,
            navigate,
            toast,
            setIsLoading
        ), 2);
    }, [banlist, navigate, toast, token]);

    const sameCardId = (left: unknown, right: unknown) =>
        String(left ?? "") === String(right ?? "");

    const updateCardStatus = useCallback((cardId: string | number, statusId: string) => {
        const statusIdNumber = parseInt(statusId, 10);
        const selectedStatus = cardStatus.find((status) => status.id === statusIdNumber);

        if (isUnlimitedBanlistStatus(selectedStatus?.label)) {
            setBanlist((prevBanlist) => ({
                ...prevBanlist,
                banlist_archetype_cards: prevBanlist.banlist_archetype_cards.filter(
                    (banlistCard) => !sameCardId(banlistCard.card.id, cardId)
                ),
            }));
            return;
        }

        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.map(banlistCard =>
                sameCardId(banlistCard.card.id, cardId)
                    ? {
                        ...banlistCard,
                        card_status_id: statusIdNumber,
                        card_status: {
                            ...banlistCard.card_status,
                            id: statusIdNumber,
                            label: selectedStatus?.label || banlistCard.card_status?.label,
                        },
                    }
                    : banlistCard
                )
            }));
    }, [cardStatus]);

    const updateCardReasons = useCallback((cardId: string | number, reasonIds: number[]) => {
        const selectedReasons = availableReasons.filter((r) => reasonIds.includes(r.id));
        setBanlist((prevBanlist) => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.map((banlistCard) =>
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
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.filter(
                (card) => !sameCardId(card.card.id, cardId)
            ),
        }));
    }, []);

    useEffect(() => {
        getCardStatus((v) => setCardStatus(prev => typeof v === 'function' ? (v as (p: CardStatus[]) => CardStatus[])(prev) : v));
        void getBanlistReasons(setAvailableReasons);
    }, []);

    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Ajouter une banlist"
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
                                release_date: formatDateForInput(banlist?.release_date)
                            }}
                            setAction={setBanlist}
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
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-semibold text-lg text-gray-900">
                            Cartes génériques de la banlist
                        </h2>
                        <p className="text-sm text-gray-500">
                            {banlist.banlist_archetype_cards.length} carte
                            {banlist.banlist_archetype_cards.length > 1 ? "s" : ""}
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
                                    searchAriaLabel="Rechercher une carte dans la banlist"
                                />
                                <div
                                    className="overflow-y-auto p-2 tablet:p-3"
                                    style={{ maxHeight: "640px" }}
                                >
                                    {banlist.banlist_archetype_cards.length > 0 ? (
                                        filteredCards.length > 0 ? (
                                            <div
                                                className={
                                                    viewMode === "grid"
                                                        ? "grid grid-cols-1 tablet:grid-cols-2 lscreen:grid-cols-3 gap-2"
                                                        : "flex flex-col gap-1.5"
                                                }
                                            >
                                                {filteredCards.map((card, index) => (
                                                    <BanlistCardComponent
                                                        key={`${card.card.id}-${index}`}
                                                        card={card}
                                                        cardStatus={cardStatus}
                                                        availableReasons={availableReasons}
                                                        updateCardStatus={updateCardStatus}
                                                        updateCardReasons={updateCardReasons}
                                                        deleteCard={deleteCard}
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
                buttonText="Ajouter la banlist"
                action={handleAddBanlist}
                disabled={isLoading}
                loadingText="Ajout en cours..."
            />
            </div>

        </AdminStructure>
    );
}

export default AdminAddBanlist