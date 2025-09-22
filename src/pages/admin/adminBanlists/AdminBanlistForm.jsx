import React from "react";
import { ToastContainer } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import { useLocation } from "react-router-dom";

const AdminBanlistForm = () => {
  const location = useLocation();
  const requestPut = location?.state?.request === "put";

  // const [newBanlist, setNewBanlist] = useState({
  //   label: '',
  //   is_active: false,
  //   release_date: '1970-01-01',
  //   description: ''
  // });
  // const [banlistCards, setBanlistCards] = useState([]);
  // const [dataIsLoaded, setDataIsLoaded] = useState(false);
  // const [orderedCardTypes, setOrderedCardTypes] = useState([]);

  // const navigate = useNavigate()

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={requestPut ? "Modifier une banlist" : "Créer une banlist"}
        catchphrase=""
      />
      {/* <AdminBanlistFormik
        banlistCardsLength={banlistCards.banlist_cards_length}
        newBanlist={newBanlist}
        setNewBanlist={setNewBanlist}
        addBanlist={() => {addBanlist(newBanlist, navigate)}}
        orderedCardTypes={orderedCardTypes}
        setDataIsLoaded={setDataIsLoaded}
        location={location}
        requestPut={requestPut}
      /> */}
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminBanlistForm;
