import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminBanlistFormik from "../../../components/pages/admin/banlist/AdminBanlistFormik";
import {
  URL_BACK_GET_BANLIST,
  URL_BACK_GET_CARD_TYPES,
} from "../../../constant/urlsBack";

const AdminBanlistForm = () => {
  const location = useLocation();
  const requestPut = location?.state?.request === "put";

  const [banlist, setBanlist] = useState({});
  const [banlistCards, setBanlistCards] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [orderedCardTypes, setOrderedCardTypes] = useState([]);

  const getBanlist = () => {
    api_aw.get(URL_BACK_GET_BANLIST(1)).then((response) => {
      if (response.status === 200) {
        const banlist = response.data;
        banlist?.cards?.sort(function (a, b) {
          return (
            orderedCardTypes.indexOf(a?.card?.cardType?.label) -
              orderedCardTypes.indexOf(b?.card?.cardType?.label) ||
            a.level - b.level
          );
        });
        setBanlist(response.data);
      }
      setDataIsLoaded(true);
    });
  };

  const getCardTypes = () => {
    api_aw.get(URL_BACK_GET_CARD_TYPES).then((response) => {
      if (response.status === 200) {
        var cardTypesOrdered = [];

        response.data.forEach((cardType) => {
          cardTypesOrdered.push(cardType.label);
        });

        setOrderedCardTypes(cardTypesOrdered);
      }
    });
  };

  useEffect(() => {
    requestPut && getBanlist();
    getCardTypes();
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={requestPut ? "Modifier une banlist" : "Créer une banlist"}
        catchphrase=""
      />
      <AdminBanlistFormik
        cardTypes={orderedCardTypes}
        banlist={banlist}
        setBanlist={setBanlist}
        banlistCards={banlistCards}
        setBanlistCards={setBanlistCards}
        dataIsLoaded={dataIsLoaded}
        setDataIsLoaded={setDataIsLoaded}
        orderedCardTypes={orderedCardTypes}
        location={location}
        requestPut={requestPut}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminBanlistForm;
