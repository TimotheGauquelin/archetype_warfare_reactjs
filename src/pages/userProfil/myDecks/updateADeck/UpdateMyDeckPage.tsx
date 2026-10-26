import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaDownload, FaHandPaper, FaTrash } from "react-icons/fa";
import DeckData from "../../../../components/pages/userProfil/deckAdd/DeckData";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { deleteMyDeck, getDeckById, updateDeck } from "../../../../services/deck";
import { toast } from "react-toastify";
import DeckUpdatator from "../../../../components/pages/userProfil/deckUpdate/DeckUpdatator";
import { laborIllusion } from "../../../../utils/functions/laborIllusion/laborIllusion";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { MAIN_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import { isDeckCardLegalForArchetype } from "../../../../utils/deck/deckCardLegality";
import type { Archetype, RootState } from "../../../../types";
import type { Deck, DeckCard, Card } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import { getArchetypesNames } from "@/services/archetype";
import TestHandContent from "@/components/pages/userProfil/deckUpdate/TestHandContent";
import ExportCmContent from "@/components/pages/userProfil/deckUpdate/ExportCmContent";

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

    const hasIllegalCards = useMemo(() => {
        return (myDeck.deck_cards ?? []).some(
            (deckCard) => !isDeckCardLegalForArchetype(deckCard, myDeck.archetype_id)
        );
    }, [myDeck.deck_cards, myDeck.archetype_id]);

    const handleUpdate = useCallback(() => {
        if (!token || !deckId) return;
        if (hasIllegalCards) {
            toast.error(t("profile.cannotSaveIllegalCards"));
            return;
        }
        setIsLoading(true);
        updateDeck(
            token,
            deckId,
            myDeck,
            toast,
            navigate,
            setIsLoading
        );
    }, [deckId, hasIllegalCards, myDeck, token, navigate, t]);

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

        openPopup({
            title: t("profile.testHand"),
            content: <TestHandContent key={Date.now()} deckCards={fullCardsMainDeck} />,
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
            content: <ExportCmContent key={Date.now()} lines={lines} />,
            showCloseButton: true,
        });
    }, [myDeck, openPopup, t]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <UserProfileLayoutTitle title={t("profile.viewDeck")} returnButton={true} />

                <div className="flex flex-row justify-end items-center gap-1 mb-2">
                    <Button
                        className="inline-flex items-center justify-center flex-1 sscreen:flex-none mt-1 sscreen:mt-2 px-2 py-1.5 sscreen:px-4 sscreen:py-2 text-xs sscreen:text-sm bg-green-200 hover:bg-green-300 text-green-700 rounded font-semibold shadow-sm"
                        ariaLabel={t("profile.testHand")}
                        icon={<FaHandPaper className="w-3.5 h-3.5 sscreen:w-4 sscreen:h-4" />}
                        action={() => { handleTestHand() }}
                    >
                        <span className="sscreen:hidden">{t("profile.testHandShort")}</span>
                        <span className="hidden sscreen:inline">{t("profile.testHand")}</span>
                    </Button>
                    <Button
                        className="inline-flex items-center justify-center flex-1 sscreen:flex-none mt-1 sscreen:mt-2 px-2 py-1.5 sscreen:px-4 sscreen:py-2 text-xs sscreen:text-sm bg-orange-100 hover:bg-orange-200 text-orange-600 rounded font-semibold shadow-sm"
                        ariaLabel={t("profile.exportCm")}
                        icon={<FaDownload className="w-3.5 h-3.5 sscreen:w-4 sscreen:h-4" />}
                        action={() => { handleExportForCM() }}
                    >
                        <span className="sscreen:hidden">{t("profile.exportCmShort")}</span>
                        <span className="hidden sscreen:inline">{t("profile.exportCm")}</span>
                    </Button>
                    <Button
                        className="inline-flex items-center justify-center flex-1 sscreen:flex-none mt-1 sscreen:mt-2 px-2 py-1.5 sscreen:px-4 sscreen:py-2 text-xs sscreen:text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded font-semibold shadow-sm"
                        ariaLabel={t("profile.deleteDeck")}
                        icon={<FaTrash className="w-3.5 h-3.5 sscreen:w-4 sscreen:h-4" />}
                        disabled={isLoading}
                        action={handleDeleteClick}
                    >
                        <span className="sscreen:hidden">{t("profile.deleteDeckShort")}</span>
                        <span className="hidden sscreen:inline">{t("profile.deleteDeck")}</span>
                    </Button>
                </div>

                {!isFetching ? (
                    <>
                        <DeckData myDeck={myDeck} setMyDeck={setMyDeck} archetypes={archetypes} />
                        <DeckUpdatator myDeck={myDeck} setMyDeck={setMyDeck} />
                        <Button
                            className="bg-blue-800 mt-2 hover:bg-blue-900 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            buttonText={t("profile.editDeck")}
                            disabled={isLoading || hasIllegalCards}
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
