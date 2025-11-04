import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import { URL_BACK_ADD_BANLIST, URL_BACK_GET_BANLIST, URL_BACK_GET_BANLISTS, URL_BACK_GET_CURRENT_BANLIST, URL_BACK_UPDATE_BANLIST } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_BANLISTS } from "../constant/urlsFront";

export const getCurrentBanlist = (setBanlist, setIsLoading) => {
    try {
        api_aw.get(URL_BACK_GET_CURRENT_BANLIST).then((response) => {
            if (response.status === 200) {
                setBanlist(response.data);
                // setLoading(false);
            }
        });
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
};

export const getBanlists = (setBanlists) => {
    try {
    api_aw.get(URL_BACK_GET_BANLISTS).then((response) => {
        if (response.status === 200) {
            setBanlists(response.data);
        }
    });
    } catch (error) {
        console.log(error);
    } finally {
    }
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

export const addBanlist = (token, newBanlist, navigate, toast, setIsLoading) => {
    try {
        api_aw_token(token).post(URL_BACK_ADD_BANLIST, newBanlist).then((response) => {
            if (response.status === 201) {
                navigate(URL_FRONT_ADMIN_BANLISTS);
                toast.success("Banlist ajoutée avec succès");
            }
        });
    } catch (error) {
        setIsLoading(false);
        console.log(error);
    } finally {
        setIsLoading(false);
    }
};

// PUT

export const updateBanlist = (token, banlistId, data, navigate, setIsLoading) => {
    try {
        api_aw_token(token).put(URL_BACK_UPDATE_BANLIST(banlistId), data).then((response) => {
            if (response.status === 200) {
                navigate(URL_FRONT_ADMIN_BANLISTS);
            }
        });
    } catch (error) {
        setIsLoading(false);
        console.log(error);
    } finally {
        setIsLoading(false);
    }
};