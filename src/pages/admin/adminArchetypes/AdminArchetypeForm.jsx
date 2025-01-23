/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import { useLocation } from "react-router-dom";
import AdminArchetypeBanlist from "../../../components/pages/admin/archetype/AdminArchetypeBanlist";
import { ToastContainer } from "react-toastify";
import AdminArchetypeSwitchButtons from "../../../components/pages/admin/archetype/AdminArchetypeSwitchButtons";
import AdminArchetypeFormik from "../../../components/pages/admin/archetype/AdminArchetypeFormik";
import { closestIndexTo } from "date-fns";
import {
  URL_BACK_GET_ARCHETYPE,
  URL_BACK_GET_BANLISTS,
  URL_BACK_GET_CARD_TYPES,
} from "../../../constant/urlsBack";

const AdminArchetypeForm = () => {
  const location = useLocation();
  const requestPut = location?.state?.request === "put";

  const [alertDisplay, setAlertDisplay] = useState(true);
  const [cardTypes, setCardTypes] = useState([]);
  const [archetype, setArchetype] = useState([]);
  const [archetypeCards, setArchetypeCards] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [cardTypeLoad, setCardTypeLoad] = useState(false);
  const [displayInformation, setDisplayInformation] = useState("mainInfo");
  const [refresh, setRefresh] = useState(false);

  const [banlists, setBanlists] = useState([]);
  const [activeBanlistId, setActiveBanlistId] = useState(1);
  const [currentBanlistCards, setCurrentBanlistCards] = useState([]);
  const [orderedCardTypes, setOrderedCardTypes] = useState([]);

  const getBanlists = () => {
    api_aw.get(URL_BACK_GET_BANLISTS).then((response) => {
      if (response.status === 200) {
        setBanlists(response.data);

        var today = new Date();
        var dateArray = response.data.map((date) => {
          return new Date(date.releaseDate);
        });

        const closestBanlistIndex = closestIndexTo(today, dateArray);
        const closestBanlistId = response.data[closestBanlistIndex].id;
        activeBanlistId === undefined && setActiveBanlistId(closestBanlistId);

        var banlistCardsOfArchetype = [];

        response.data.forEach((banlist) => {
          if (banlist.id === activeBanlistId) {
            banlist?.cards.forEach((card) => {
              if (card?.archetype?.id === location?.state?.id) {
                banlistCardsOfArchetype.push(card);
              }
            });
          }
        });
        setCurrentBanlistCards(banlistCardsOfArchetype);
      }
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

  const updateGetArchetype = () => {
    api_aw.get(URL_BACK_GET_ARCHETYPE(location?.state?.id)).then((response) => {
      if (response.status === 200) {
        setArchetype(response.data);
        setArchetypeCards(response.data.cards);
      }
      setDataIsLoaded(true);
    });
  };

  useEffect(() => {
    requestPut && updateGetArchetype();
    setCardTypeLoad(false);
    getBanlists();
    getCardTypes();
    setRefresh(false);
  }, [cardTypeLoad, refresh]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={`${
          location?.state?.request === "put"
            ? `Modifier l'archetype ${archetype.name}`
            : "Ajouter un archétype"
        } `}
        catchphrase=""
        returnButton
      />
      <AdminArchetypeSwitchButtons
        setAlertDisplay={setAlertDisplay}
        setDisplayInformation={setDisplayInformation}
        // actionBanlist={() => {
        //   setAlertDisplay(true);
        // }}
        location={location}
      />
      <AdminArchetypeFormik
        dataIsLoaded={dataIsLoaded}
        displayInformation={displayInformation}
        requestPut={requestPut}
        archetype={archetype}
        setArchetype={setArchetype}
        archetypeCards={archetypeCards}
        orderedCardTypes={orderedCardTypes}
        location={location}
        setDataIsLoaded={setDataIsLoaded}
        setCardTypeLoad={setCardTypeLoad}
        setRefresh={setRefresh}
        cardTypes={cardTypes}
        setCardTypes={setCardTypes}
        setArchetypeCards={setArchetypeCards}
      />

      {dataIsLoaded && displayInformation === "banlist" && (
        <AdminArchetypeBanlist
          banlists={banlists}
          activeBanlistId={activeBanlistId}
          setActiveBanlistId={setActiveBanlistId}
          currentBanlistCards={currentBanlistCards}
          setCurrentBanlistCards={setCurrentBanlistCards}
          orderedCardTypes={orderedCardTypes}
        />
      )}
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminArchetypeForm;
