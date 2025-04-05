import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_STATUS} from "../constant/urlsBack";

export const getCardStatus = (setAllCardStatus) => {
    api_aw.get(URL_BACK_GET_ALL_CARD_STATUS).then((response) => {
        if (response.status === 200) {
            setAllCardStatus(response.data);
        }
    });
};