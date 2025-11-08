
import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_TYPES } from "../constant/urlsBack";

/**
 * Retrieve all card types
 * @param {function} setAllCardTypes - Function to set all card types
 */
export const getCardTypes = (setAllCardTypes) => {
    try {
        api_aw.get(URL_BACK_GET_ALL_CARD_TYPES)
        .then((response) => {
            if (response.status === 200) {
                setAllCardTypes(response.data.data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
};