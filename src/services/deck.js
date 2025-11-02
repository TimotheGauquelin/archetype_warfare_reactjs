import { api_aw_token } from "../api/api_aw_token";
import { URL_BACK_CREATE_DECK, URL_BACK_GET_ALL_MY_DECKS, URL_BACK_GET_DECK_BY_ID, URL_BACK_UPDATE_DECK } from "../constant/urlsBack";
import { URL_FRONT_MY_DECKS } from "../constant/urlsFront";

export const getMyDecks = (token, id, setMyDecks) => {
    api_aw_token(token).get(URL_BACK_GET_ALL_MY_DECKS(id))
    .then((response) => {
        if (response.status === 200) {
            setMyDecks(response.data);
        }
    })
    .catch((error) => {
        console.log(error);
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