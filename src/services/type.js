import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_TYPES } from "../constant/urlsBack";

export const getTypes = (setTypes) => {
    api_aw
        .get(URL_BACK_GET_ALL_TYPES)
        .then((response) => {
            if (response.status === 200) {
                setTypes(response.data)
            }
        });
};