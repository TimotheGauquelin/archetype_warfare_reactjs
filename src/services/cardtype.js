
import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_TYPES} from "../constant/urlsBack";

export const getCardTypes = (setAllCardTypes) => {
    api_aw.get(URL_BACK_GET_ALL_CARD_TYPES).then((response) => {
        if (response.status === 200) {
            setAllCardTypes(response.data);
        }
    });
};