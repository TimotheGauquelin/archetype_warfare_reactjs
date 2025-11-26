import { URL_BACK_TOGGLE_REGISTRATION, URL_BACK_TOGGLE_STREAM_BAR } from "../constant/urlsBack";
import { URL_BACK_GET_CONFIG } from "../constant/urlsBack";
import { api_aw_token } from "../api/api_aw_token";
import api_aw from "../api/api_aw";

export const getConfig = (setConfig, setIsFetching) => {
    // setIsFetching(true);
    api_aw
        .get(URL_BACK_GET_CONFIG)
        .then((response) => {
            if (response.status === 200) {
                setConfig(response.data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération de la configuration:", error);
            setConfig({});
        })
        .finally(() => {
            // setIsFetching(false);
        });
}

export const toggleStreamBar = (token, setIsUpdating, toast) => {
    api_aw_token(token)
        .put(URL_BACK_TOGGLE_STREAM_BAR)
        .then((response) => {
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        })
        .catch((error) => {
            toast.error("Erreur lors de l'affichage de la bannière de streaming");
            setIsUpdating(false);
        })
        .finally(() => {
            setIsUpdating(false);
        });
}

export const toggleRegistration = (token, setIsUpdating, toast) => {
    setIsUpdating(true);
    api_aw_token(token)
        .put(URL_BACK_TOGGLE_REGISTRATION)
        .then((response) => {
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la modification des inscriptions:", error);
        })
        .finally(() => {
            setIsUpdating(false);
        });
}