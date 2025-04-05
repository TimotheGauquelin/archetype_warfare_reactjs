import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_SUMMON_MECHANICS } from "../constant/urlsBack";

export const getSummonMechanics = (setSummonMechanics) => {
    api_aw
        .get(URL_BACK_GET_ALL_SUMMON_MECHANICS)
        .then((response) => {
            if (response.status === 200) {
                setSummonMechanics(response.data)
            }
        });
};