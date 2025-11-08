import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_STATUS } from "../constant/urlsBack";

/**
 * Retrieve all card statuses
 * @param {function} setAllCardStatus - Function to set all card statuses
 */
export const getCardStatus = (setAllCardStatus) => {
    try {
        api_aw.get(URL_BACK_GET_ALL_CARD_STATUS)
            .then((response) => {
                if (response.status === 200) {
                    setAllCardStatus(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
};