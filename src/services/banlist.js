import api_aw from "../api/api_aw";
import { URL_BACK_ADD_BANLIST, URL_BACK_GET_BANLISTS, URL_BACK_GET_CURRENT_BANLIST } from "../constant/urlsBack";
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

// POST

export const addBanlist = (newBanlist, navigate) => {
    try {
        console.log(newBanlist);
        api_aw.post(URL_BACK_ADD_BANLIST, newBanlist).then((response) => {
            if (response.status === 201) {
                navigate(URL_FRONT_ADMIN_BANLISTS);
            }
        });
    } catch (error) {
        console.log(error);
    }
};