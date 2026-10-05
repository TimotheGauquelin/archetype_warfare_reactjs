import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DeckData from "../../../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { deleteMyDeck, getDeckById, updateDeck } from "../../../../services/deck";
import { toast } from "react-toastify";
import DeckUpdatator from "../../../../components/pages/userProfil/deckUpdate/DeckUpdatator";
import { laborIllusion } from "../../../../utils/functions/laborIllusion/laborIllusion";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { FaCopy } from "react-icons/fa";
import { MAIN_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import type { Archetype, RootState } from "../../../../types";
import type { Deck, DeckCard, Card } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { getArchetypesNames } from "@/services/archetype";

const UpdateMyDeckPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { deckId } = useParams<{ deckId?: string }>();
    const { token } = useSelector((state: RootState) => state.user);
    const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

    const [archetypes, setArchetypes] = useState<Archetype[]>([]);

    const [myDeck, setMyDeck] = useState<Deck>({
        label: "",
        comment: "",
        archetype_id: undefined,
        archetype: {
            id: 0,
            label: "",
            card_img_url: "",
            is_active: true,
        },
        user_id: undefined,
        deck_cards: []
    });

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
        getArchetypesNames(setArchetypes);
    }, [token, deckId, navigate, locale]);

    const handleDelete = useCallback(() => {
        if (!token || !deckId) return;
        setIsLoading(true);
        laborIllusion(() => {
            deleteMyDeck(token, deckId, setIsLoading, navigate, toast);
        }, 1);
    }, [deckId, token, navigate]);

    const handleDeleteClick = useCallback(() => {
        showConfirmDialog({
            title: t("profile.deleteDeckTitle"),
            message: t("profile.deleteDeckConfirm"),
            onConfirm: () => {
                handleDelete();
            },
            confirmText: t("profile.delete"),
            cancelText: t("common.cancel")
        });
    }, [showConfirmDialog, handleDelete, t]);

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
    }, [deckId, myDeck, token, navigate]);

    const handleTestHand = useCallback(() => {
        const mainDeckCards = (myDeck?.deck_cards || []).filter((deckCard: DeckCard) => {
            const cardType = deckCard.card?.card_type || deckCard.card?.cardType?.label || "";
            return MAIN_DECK_LABELS.includes(cardType.toLowerCase());
        });
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
            title: t("profile.testHand"),
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
    }, [myDeck, openPopup, t]);

    const handleExportForCM = useCallback(() => {
        const lines = (myDeck?.deck_cards || []).map((dc: DeckCard) => {
            const qty = dc.quantity ?? 0;
            const name = dc.card?.name || "";
            return `${qty} ${name}`;
        });

        openPopup({
            title: t("profile.exportCm"),
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
                            {lines.length ? lines.join("\n") : t("profile.noCardsInDeck")}
                        </pre>
                    </div>
                </div>
            ),
            showCloseButton: true,
        });
    }, [myDeck, openPopup, t]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <UserProfileLayoutTitle title={t("profile.viewDeck")} returnButton={true} />

                <div className="flex flex-row justify-end items-center gap-1 mb-2">
                    <Button
                        className="bg-blue-200 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText={t("profile.testHand")}
                        action={() => { handleTestHand() }}
                    />
                    <Button
                        className="bg-blue-200 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText={t("profile.exportCm")}
                        action={() => { handleExportForCM() }}
                    />
                    <Button
                        className="bg-red-200 mt-2 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                        buttonText={t("profile.deleteDeck")}
                        disabled={isLoading}
                        loadingText={t("profile.deletingDeck")}
                        action={handleDeleteClick}
                    />
                </div>

                {!isFetching ? (
                    <>
                        <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
                        <DeckUpdatator myDeck={myDeck} setMyDeck={setMyDeck} />
                        <Button
                            className="bg-blue-500 mt-2 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
                            buttonText={t("profile.editDeck")}
                            disabled={isLoading}
                            loadingText={t("profile.updatingDeck")}
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
