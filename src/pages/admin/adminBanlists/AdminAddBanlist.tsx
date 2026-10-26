import React, { useCallback, useEffect, useState } from 'react'
import AdminStructure from '../adminLayout';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { Input } from '../../../components/generic/form/input/Input';
import AdminBanlistAddCard, { type BanlistFormLike as AdminBanlistFormLike } from '../../../components/pages/admin/banlist/AdminBanlistAddCard';
import BanlistCardComponent from '../../../components/generic/BanlistCard';
import Button from '../../../components/generic/buttons/classicButton/Button';
import { getCardStatus } from '../../../services/cardStatus';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import { addBanlist } from '../../../services/banlist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateForInput } from '../../../utils/date/formatDateForInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import type { Banlist, BanlistCard } from '../../../types';
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
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useSelector((state: RootState) => state.user);

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

            return {
                card_id: String(cardId),
                card_status_id: cardStatusIdNumber,
                explanation_text: item.explanation_text ?? null,
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

    const updateCardStatus = useCallback((cardId: number, statusId: string) => {
        const statusIdNumber = parseInt(statusId, 10);
        const selectedStatus = cardStatus.find((status) => status.id === statusIdNumber);

        if (isUnlimitedBanlistStatus(selectedStatus?.label)) {
            setBanlist((prevBanlist) => ({
                ...prevBanlist,
                banlist_archetype_cards: prevBanlist.banlist_archetype_cards.filter(
                    (banlistCard) => banlistCard.card.id !== cardId
                ),
            }));
            return;
        }

        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.map(banlistCard =>
                banlistCard.card.id === cardId
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

    const updateCardExplanation = useCallback((cardId: number, explanation: string) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.map(banlistCard =>
                banlistCard.card.id === cardId
                    ? { ...banlistCard, explanation_text: explanation }
                    : banlistCard
                )
        }));
    }, []);

    const deleteCard = useCallback((cardId: number) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.filter(card => card.card.id !== cardId)
        }));
    }, []);

    useEffect(() => {
        getCardStatus((v) => setCardStatus(prev => typeof v === 'function' ? (v as (p: CardStatus[]) => CardStatus[])(prev) : v));
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
                <h2 className="font-semibold text-lg text-gray-900">
                    Cartes génériques de la banlist ({banlist.banlist_archetype_cards.length})
                </h2>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8">
                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto"
                            style={{ height: "500px" }}
                        >
                            {banlist.banlist_archetype_cards.length > 0 ? (
                                <div className="grid grid-cols-12 gap-4">
                                    {banlist.banlist_archetype_cards.map((card, index) => (
                                        <div
                                            key={`${card.card.id}-${index}`}
                                            className="col-span-4"
                                        >
                                            <BanlistCardComponent
                                                card={card}
                                                cardStatus={cardStatus}
                                                updateCardStatus={updateCardStatus}
                                                updateCardExplanation={updateCardExplanation}
                                                deleteCard={deleteCard}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Aucune carte générique dans cette banlist</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <AdminBanlistAddCard banlist={banlist} setBanlist={setBanlist as React.Dispatch<React.SetStateAction<AdminBanlistFormLike>>} />
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