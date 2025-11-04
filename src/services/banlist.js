import api_aw from "../api/api_aw";
import { URL_BACK_ADD_BANLIST, URL_BACK_GET_BANLIST, URL_BACK_GET_BANLISTS, URL_BACK_GET_CURRENT_BANLIST, URL_BACK_UPDATE_BANLIST } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_BANLISTS } from "../constant/urlsFront";

export const getCurrentBanlist = (setBanlist, setLoading) => {
    api_aw.get(URL_BACK_GET_CURRENT_BANLIST).then((response) => {
        if (response.status === 200) {
            setBanlist(response.data);
            // setLoading(false);
        }
    });
};

export const getBanlists = (setBanlists) => {
    api_aw.get(URL_BACK_GET_BANLISTS).then((response) => {
        if (response.status === 200) {
            setBanlists(response.data);
        }
    });
};

export const getBanlistById = (id, setBanlist) => {
    try {
        api_aw.get(URL_BACK_GET_BANLIST(id)).then((response) => {
            if (response.status === 200) {
                setBanlist(response.data);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// POST

export const addBanlist = (newBanlist, navigate) => {
    try {
        api_aw.post(URL_BACK_ADD_BANLIST, newBanlist).then((response) => {
            if (response.status === 201) {
                navigate(URL_FRONT_ADMIN_BANLISTS);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// PUT

export const updateBanlist = (banlistId, data, navigate, setIsLoading) => {
    try {
        api_aw.put(URL_BACK_UPDATE_BANLIST(banlistId), data).then((response) => {
            if (response.status === 200) {
                navigate(URL_FRONT_ADMIN_BANLISTS);
            }
        });
    } catch (error) {
        console.log(error);
        setIsLoading(false);
    }
};