import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_ERAS } from "../constant/urlsBack";

export const getEras = (setEras) => {
    api_aw
        .get(URL_BACK_GET_ALL_ERAS)
        .then((response) => {
            if (response.status === 200) {
                setEras(response.data)
            }
        })
        .catch((error) => {
           console.log(error);
        });
};