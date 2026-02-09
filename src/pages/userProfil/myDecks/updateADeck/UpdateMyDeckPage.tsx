import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DeckData from "../../../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { deleteMyDeck, getDeckById, updateDeck } from "../../../../services/deck";
import { toast } from "react-toastify";
import { useArchetypesName } from "../../../../hooks/useArchetypesName";
import DeckUpdatator from "../../../../components/pages/userProfil/deckUpdate/DeckUpdatator";
import { laborIllusion } from "../../../../utils/functions/laborIllusion/laborIllusion";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { FaCopy } from "react-icons/fa";
import { MAIN_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import type { RootState } from "../../../../types";
import type { Deck, DeckCard, Card } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";

const UpdateMyDeckPage = () => {
    const navigate = useNavigate();
    const { deckId } = useParams<{ deckId?: string }>();
    const { token } = useSelector((state: RootState) => state.user);

    const [myDeck, setMyDeck] = useState<Deck>({
        label: "",
        comment: "",
        archetype_id: undefined,
        user_id: undefined,
        deck_cards: []
    });

    const { archetypes } = useArchetypesName();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const { isOpen, popupConfig, closePopup, showConfirmDialog, openPopup } = usePopup();

    useEffect(() => {
        setIsFetching(true);
        if (token && deckId) {
            getDeckById(
                token,
                deckId,
                setMyDeck,
                setIsFetching,
                toast,
                navigate
            );
        }
    }, [token, deckId, navigate]);

    const handleDelete = useCallback(() => {
        if (!token || !deckId) return;
        setIsLoading(true);
        laborIllusion(() => {
            deleteMyDeck(token, deckId, setIsLoading, navigate, toast);
        }, 1);
    }, [deckId, token, setIsLoading, navigate, toast]);

    const handleDeleteClick = useCallback(() => {
        showConfirmDialog({
            title: 'Supprimer le deck',
            message: 'Êtes-vous sûr de vouloir supprimer ce deck ? Cette action est irréversible.',
            onConfirm: () => {
                handleDelete();
            },
            confirmText: 'Supprimer',
            cancelText: 'Annuler'
        });
    }, [showConfirmDialog, handleDelete]);

    const handleUpdate = useCallback(() => {
        if (!token || !deckId) return;
        setIsLoading(true);
        updateDeck(
            token,
            deckId,
            myDeck,
            toast,
            navigate,
            setIsLoading
        );
    }, [deckId, myDeck, token, navigate, toast, setIsLoading]);

    const handleTestHand = useCallback(() => {
        const mainDeckCards = (myDeck?.deck_cards || []).filter((deckCard: DeckCard) => {
            const cardType = deckCard.card?.card_type || deckCard.card?.cardType?.label || "";
            return MAIN_DECK_LABELS.includes(cardType.toLowerCase());
        });
        console.log(mainDeckCards);
        const fullCardsMainDeck: Card[] = [];
        for (const deckCard of mainDeckCards) {
            for (let i = 0; i < (deckCard.quantity || 0); i++) {
                if (deckCard.card) {
                    fullCardsMainDeck.push(deckCard.card);
                }
            }
        }

        const getFiveRandomCards = fullCardsMainDeck.sort(() => Math.random() - 0.5).slice(0, 5);

        openPopup({
            title: "Tester une main",
            content: (
                <div>
                    <div>
                        <div className="grid grid-cols-10 gap-1 p-2">
                            {getFiveRandomCards.map((card, index) => (
                                <img key={card.id + index} className="col-span-2" src={card.img_url || card.img_url} alt={card.name} loading="lazy" />
                            ))}
                        </div>
                    </div>
                </div>
            ),
            showCloseButton: true,
        });
    }, [myDeck, openPopup, MAIN_DECK_LABELS]);

    const handleExportForCM = useCallback(() => {
        const lines = (myDeck?.deck_cards || []).map((dc: DeckCard) => {
            const qty = dc.quantity ?? 0;
            const name = dc.card?.name || "";
            return `${qty} ${name}`;
        });

        openPopup({
            title: "Exporter pour CM",
            content: (
                <div>
                    <div className="flex flex-row justify-end items-center gap-1 mb-2">
                        <FaCopy
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(lines.join("\n"));
                            }}
                        />
                    </div>
                    <div className="space-y-2 bg-gray-100 p-2">
                        <pre className="whitespace-pre-wrap text-sm">
                            {lines.length ? lines.join("\n") : "Aucune carte dans le deck."}
                        </pre>
                    </div>
                </div>
            ),
            showCloseButton: true,
        });
    }, [myDeck, openPopup]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <UserProfileLayoutTitle title="Voir mon deck" returnButton={true} />

                <div className="flex flex-row justify-end items-center gap-1 mb-2">
                    <Button
                        className="bg-blue-200 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText="Tester une main"
                        action={() => { handleTestHand() }}
                    />
                    <Button
                        className="bg-blue-200 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText="Exporter pour CM"
                        action={() => { handleExportForCM() }}
                    />
                    <Button
                        className="bg-red-200 mt-2 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText="Supprimer mon deck"
                        disabled={isLoading}
                        loadingText="Suppression en cours..."
                        action={handleDeleteClick}
                    />
                </div>

                {!isFetching ? (
                    <>
                        <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
                        <DeckUpdatator myDeck={myDeck} setMyDeck={setMyDeck} />
                        <Button
                            className="bg-blue-500 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                            buttonText="Modifier mon deck"
                            disabled={isLoading}
                            loadingText="Modification en cours..."
                            action={handleUpdate}
                        />
                    </>
                ) : (
                    <div className="p-4 bg-gray-300 rounded-lg animate-pulse h-24">
                    </div>
                )}
            </div>

            <PopUp
                isOpen={isOpen}
                onClose={closePopup}
                title={popupConfig.title}
                className={popupConfig.className}
                showCloseButton={popupConfig.showCloseButton}
            >
                {popupConfig.content}
            </PopUp>
        </UserProfilLayout >
    );
};

export default UpdateMyDeckPage;