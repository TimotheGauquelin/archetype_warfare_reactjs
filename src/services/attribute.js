import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_ATTRIBUTES } from "../constant/urlsBack";

export const getAttributes = (setAttributes) => {
    api_aw
        .get(URL_BACK_GET_ALL_ATTRIBUTES)
        .then((response) => {
            if (response.status === 200) {
                setAttributes(response.data)
            }
        });
};