import React, { useCallback, useEffect, useState } from 'react'
import AdminStructure from '../adminLayout';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { SwitchInput } from '../../../components/generic/form/SwitchInput';
import { Input } from '../../../components/generic/form/input/Input';
import { FaTrashAlt } from 'react-icons/fa';
import AdminBanlistAddCard, { type BanlistFormLike as AdminBanlistFormLike } from '../../../components/pages/admin/banlist/AdminBanlistAddCard';
import { cardStatusToFrench } from '../../../utils/trad/cardStatus';
import Button from '../../../components/generic/buttons/classicButton/Button';
import { getCardStatus } from '../../../services/cardStatus';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import { addBanlist } from '../../../services/banlist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateForInput } from '../../../utils/date/databaseDataToInput';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import type { BanlistCard } from '../../../types';

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
        setIsLoading(true);
        laborIllusion(() => addBanlist(token, banlist, navigate, toast, setIsLoading), 2);
    }, [banlist, navigate, toast, token]);

    const updateCardStatus = useCallback((cardId: number, statusId: string) => {
        setBanlist(prevBanlist => ({
            ...prevBanlist,
            banlist_archetype_cards: prevBanlist.banlist_archetype_cards.map(banlistCard =>
                banlistCard.card.id === cardId
                    ? { ...banlistCard, card_status_id: parseInt(statusId) }
                    : banlistCard
                )
            }));
    }, []);

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
                            release_date: formatDateForInput(banlist?.release_date)
                        }}
                        setAction={setBanlist}
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

            <div className="bg-gray-300 rounded p-4 mb-4">
                <h2 className="font-bold text-xl mb-4">
                    Cartes génériques de la banlist ({banlist.banlist_archetype_cards.length})
                </h2>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8">
                        <div
                            className="bg-white rounded-lg p-4 overflow-y-auto"
                            style={{ height: "500px" }}
                        >
                            {banlist.banlist_archetype_cards.length > 0 ? (
                                <div className="grid grid-cols-12 gap-4">
                                    {banlist.banlist_archetype_cards.map((card, index) => (
                                        <div
                                            key={`${card.card.id}-${index}`}
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
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 shadow-sm"
                buttonText="Ajouter la banlist"
                action={handleAddBanlist}
                disabled={isLoading}
                loadingText="Ajout en cours..."
            />

        </AdminStructure>
    );
}

export default AdminAddBanlist