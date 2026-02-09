import React, { useEffect, useState, useMemo, useCallback } from 'react'
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { Input } from '../../../components/generic/form/input/Input';
import { getBanlistById, updateBanlist } from '../../../services/banlist';
import { getCardTypes } from '../../../services/cardtype';
import { FaTrashAlt } from 'react-icons/fa';
import AdminBanlistAddCard, { type BanlistFormLike as AdminBanlistFormLike } from '../../../components/pages/admin/banlist/AdminBanlistAddCard';
import { getCardStatus } from '../../../services/cardStatus';
import { cardStatusToFrench } from '../../../utils/trad/cardStatus';
import Button from '../../../components/generic/buttons/classicButton/Button';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import { formatDateForInput } from '../../../utils/date/databaseDataToInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import type { Banlist, BanlistCard } from '../../../types';

interface CardType { id: number; label: string; num_order?: number; [key: string]: unknown }
interface CardStatus { id: number; label: string; [key: string]: unknown }

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
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    const { token } = useSelector((state: RootState) => state.user);
    const { banlistId } = useParams<{ banlistId?: string }>();
    const navigate = useNavigate();

    const loadBanlistData = useCallback(async () => {
        if (!banlistId) return;

        setIsFetching(true);
        setError(null);

        try {
            await Promise.all([
                getBanlistById(banlistId, (v) => setBanlist(prev => typeof v === 'function' ? (v as (p: Banlist | AdminBanlistFormLike) => Banlist | AdminBanlistFormLike)(prev) : v)),
                getCardTypes((v) => setCardTypes(prev => typeof v === 'function' ? (v as (p: CardType[]) => CardType[])(prev) : v)),
                getCardStatus((v) => setCardStatus(prev => typeof v === 'function' ? (v as (p: CardStatus[]) => CardStatus[])(prev) : v))
            ]);
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
        return sortedCards.filter((card: BanlistCard) => card.card?.archetype_id == null);
    }, [sortedCards]);

    const updateCardStatus = useCallback((cardId: number, statusId: string) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).map((banlistCard: BanlistCard) =>
                banlistCard.card.id === cardId
                    ? {
                        ...banlistCard,
                        card_status_id: parseInt(statusId),
                        card_status: {
                            ...banlistCard.card_status,
                            id: parseInt(statusId)
                        }
                    }
                    : banlistCard
            )
        }));
    }, []);

    const updateCardExplanation = useCallback((cardId: number, explanation: string) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).map((banlistCard: BanlistCard) =>
                banlistCard.card.id === cardId
                    ? {
                        ...banlistCard,
                        explanation_text: explanation
                    }
                    : banlistCard
            )
        }));
    }, []);

    const deleteCard = useCallback((cardId: number) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: (prevBanlist.banlist_archetype_cards || []).filter(
                (card: BanlistCard) => card.card.id !== cardId
            )
        }));
    }, []);

    const handleUpdateBanlist = useCallback(() => {
        if (!banlistId || !token) return;
        setIsLoading(true);
        const updatedBanlist = {
            ...banlist,
            banlist_archetype_cards: (banlist.banlist_archetype_cards || []).map((card: BanlistCard) => ({
                ...card,
                banlist_id: parseInt(banlistId)
            }))
        };

        laborIllusion(() => updateBanlist(token, banlistId, updatedBanlist as Banlist, navigate, setIsLoading), 1);
    }, [banlist, banlistId, navigate, token]);

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

    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Modifier une banlist"
                catchphrase="Gérez les cartes et leurs statuts"
                returnButton
            />

            {/* Informations principales */}
            <div className="bg-gray-300 rounded p-4 mb-4">
                <div className="flex flex-row justify-between items-center mb-2">
                    <h2 className="font-bold text-xl">Informations Principales</h2>
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

                <div className="mt-4">
                    <Input
                        label="Description"
                        required
                        inputType="text"
                        attribute="description"
                        data={banlist}
                        setAction={setBanlist}
                    />
                </div>
            </div>

            {/* Section des cartes */}
            <div className="bg-gray-300 rounded p-4 mb-4">
                <h2 className="font-bold text-xl mb-4">
                    Cartes génériques de la banlist ({genericCards.length})
                </h2>

                <div className="grid grid-cols-12 gap-4">
                    {/* Liste des cartes */}
                    <div className="col-span-8">
                        <div
                            className="bg-white rounded-lg p-4 overflow-y-auto"
                            style={{ height: "500px" }}
                        >
                            {genericCards.length > 0 ? (
                                <div className="grid grid-cols-12 gap-4">
                                    {genericCards.map((card, index) => 
                                    {
                                        console.log(card);
                                        return(
                                        <div
                                            key={`${card.card?.id}-${index}`}
                                            className="col-span-4"
                                        >
                                            <div className="bg-gray-50 rounded-lg p-3 border">
                                                <div className="relative mb-3">
                                                    <img
                                                        className="w-full rounded-lg hover:saturate-150 transition-all duration-200"
                                                        src={card?.card?.img_url}
                                                        alt={card?.card?.name}
                                                    />
                                                    <button
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                                                        onClick={() => deleteCard(card?.card?.id)}
                                                        title="Supprimer cette carte"
                                                    >
                                                        <FaTrashAlt size={12} />
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Statut
                                                        </label>
                                                        <select
                                                            value={card.card_status?.id || ""}
                                                            onChange={(e) => updateCardStatus(card.card.id, e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            {cardStatus.map((status) => (
                                                                <option key={status.id} value={status.id}>
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
                                                            onChange={(e) => updateCardExplanation(card.card.id, e.target.value)}
                                                            placeholder="Explication du statut..."
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )})}
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
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 shadow-sm"
                buttonText="Modifier la banlist"
                action={handleUpdateBanlist}
                disabled={isLoading}
                loadingText="Modification en cours..."
            />

        </AdminStructure>
    );
}

export default AdminUpdateBanlist;