import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminBanlistFormik from "../../../components/pages/admin/banlist/AdminBanlistFormik";
import { addBanlist } from "../../../services/banlist";

const AdminBanlistForm = () => {
  const location = useLocation();
  const requestPut = location?.state?.request === "put";

  const [newBanlist, setNewBanlist] = useState({
    label: '',
    is_active: false,
    release_date: '1970-01-01',
    description: ''
  });
  const [banlistCards, setBanlistCards] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [orderedCardTypes, setOrderedCardTypes] = useState([]);

  const navigate = useNavigate()

  // const getBanlist = () => {
  //   api_aw.get(URL_BACK_GET_BANLIST(1)).then((response) => {
  //     if (response.status === 200) {
  //       const banlist = response.data;
  //       banlist?.cards?.sort(function (a, b) {
  //         return (
  //           orderedCardTypes.indexOf(a?.card?.cardType?.label) -
  //             orderedCardTypes.indexOf(b?.card?.cardType?.label) ||
  //           a.level - b.level
  //         );
  //       });
  //       setBanlist(response.data);
  //     }
  //     setDataIsLoaded(true);
  //   });
  // };

  // const getCardTypes = () => {
  //   api_aw.get(URL_BACK_GET_CARD_TYPES).then((response) => {
  //     if (response.status === 200) {
  //       var cardTypesOrdered = [];

  //       response.data.forEach((cardType) => {
  //         cardTypesOrdered.push(cardType.label);
  //       });

  //       setOrderedCardTypes(cardTypesOrdered);
  //     }
  //   });
  // };

  useEffect(() => {
    // requestPut && getBanlist();
    // getCardTypes();
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={requestPut ? "Modifier une banlist" : "Créer une banlist"}
        catchphrase=""
      />
      <AdminBanlistFormik
        // banlist={banlist}
        // setBanlist={setBanlist}
        banlistCardsLength={banlistCards.banlist_cards_length}
        newBanlist={newBanlist}
        setNewBanlist={setNewBanlist}
        addBanlist={() => {addBanlist(newBanlist, navigate)}}
        orderedCardTypes={orderedCardTypes}
        setDataIsLoaded={setDataIsLoaded}
        location={location}
        requestPut={requestPut}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminBanlistForm;
