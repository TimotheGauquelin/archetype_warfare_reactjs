import { api_aw_token } from "../api/api_aw_token";
import { URL_BACK_CREATE_DECK, URL_BACK_DELETE_MY_DECK, URL_BACK_GET_ALL_MY_DECKS, URL_BACK_GET_DECK_BY_ID, URL_BACK_UPDATE_DECK } from "../constant/urlsBack";
import { URL_FRONT_MY_DECKS } from "../constant/urlsFront";

export const getMyDecks = (token, id, setMyDecks, setIsFetching) => {
    setIsFetching(true);
    api_aw_token(token).get(URL_BACK_GET_ALL_MY_DECKS(id))
        .then((response) => {
            if (response.status === 200) {
                setMyDecks(response.data);
                setIsFetching(false);
            }
        })
        .catch((error) => {
            console.log(error);
            setIsFetching(false);
        });
};

export const getDeckById = (token, deckId, setDeck, setIsFetching, toast, navigate) => {
    api_aw_token(token).get(URL_BACK_GET_DECK_BY_ID(deckId))
        .then((response) => {
            if (response.status === 200) {
                setDeck(response.data);
                setIsFetching(false);
            }
        })
        .catch((error) => {
            console.log(error);
            toast.error("Impossible de récupérer le deck");
            navigate(URL_FRONT_MY_DECKS);
        });
};

export const createDeck = (token, myDeck, toast, navigate, setIsLoading) => {
    setIsLoading(true);
    api_aw_token(token).post(URL_BACK_CREATE_DECK, myDeck)
        .then((response) => {
            console.log(response);
            if (response.status === 201) {
                setIsLoading(false);
                navigate(URL_FRONT_MY_DECKS);
                toast.success("Deck créé avec succès");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            toast.error("Une erreur est survenue lors de la création du deck");
        });
};

// PUT

export const updateDeck = (token, deckId, myDeck, toast, navigate, setIsLoading) => {
    api_aw_token(token).put(URL_BACK_UPDATE_DECK(deckId), myDeck)
        .then((response) => {
            if (response.status === 200) {
                setIsLoading(false);
                toast.success("Deck modifié avec succès");
                navigate(URL_FRONT_MY_DECKS);
            }
        })
        .catch((error) => {
            toast.error("Une erreur est survenue lors de la modification du deck");
            setIsLoading(false);
        });
};


// DELETE
/**
 * Delete a deck
 * @param {string} token - Token of the user
 * @param {string} deckId - Id of the deck
 * @param {function} setIsLoading - Function to set is loading
 * @param {function} navigate - Function to navigate
 * @param {function} toast - Function to show toast
 */
export const deleteMyDeck = (token, deckId, setIsLoading, navigate, toast) => {
    try {
        api_aw_token(token).delete(URL_BACK_DELETE_MY_DECK(deckId))
            .then((response) => {
                if (response.status === 200) {
                    setIsLoading(false);
                    toast.success("Deck supprimé avec succès");
                    navigate(URL_FRONT_MY_DECKS);
                }
            })
            .catch((error) => {
                toast.error("Une erreur est survenue lors de la suppression du deck");
                setIsLoading(false);
            });
    } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Une erreur est survenue lors de la suppression du deck");
    }
};