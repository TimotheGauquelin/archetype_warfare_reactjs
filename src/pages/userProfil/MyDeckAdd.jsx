import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api_aw from "../../api/api_aw";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import DeckCreator from "../../components/pages/userProfil/deckAdd/DeckCreator";
import DeckSearcher from "../../components/pages/userProfil/deckAdd/DeckSearcher";
import { Form, Formik } from "formik";

const MyDeckAdd = () => {
  const { token } = useSelector((state) => state.user);
  var decoded = jwt_decode(token);
  const location = useLocation();

  const history = useNavigate();
  let { deckId } = useParams();
  const requestPut = location?.state?.request === "put";
  const [myDeck, setMyDeck] = useState({});
  const [archetypeCards, setArchetypeCards] = useState([]);
  const [deckCards, setDeckCards] = useState([
    { label: "mainDeck", cards: [] },
    { label: "extraDeck", cards: [] },
  ]);
  const [cardTypes, setCardTypes] = useState([]);
  const [currentArchetypeId, setCurrentArchetypeId] = useState(1000);
  const [currentBanlistId, setCurrentBanlistId] = useState(1);
  const [researchedCardsLabel, setResearchedCardsLabel] = useState("");
  const [researchedCardsLength, setResearchedCardsLength] = useState(0);

  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const getCardTypes = () => {
    api_aw.get(`/public/cardTypes`).then((response) => {
      if (response.status === 200) {
        var cardTypesOrdered = [];

        response.data.forEach((cardType) => {
          cardTypesOrdered.push(cardType.label);
        });

        setCardTypes(cardTypesOrdered);
        !requestPut && setDataIsLoaded(true);
      }
    });
  };

  const addDeck = (values) => {
    console.log(values);

    const newDate = new Date();

    const allDeckCards = [];

    values.cards.map((deck) => {
      deck.cards.map((card) => {
        allDeckCards.push(card);
      });
    });

    const deckSchema = {
      label: values.label,
      comment: values.comment,
      createdAt: newDate.toISOString().split("T")[0] + "T22:00:00Z",
      archetype: values.archetype,
      userAccount: values.userAccount,
      isActive: values.isActive,
      cards: allDeckCards,
    };

    console.log(deckSchema);

    api_aw
      .post(`/public/decks`, deckSchema, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 201) {
          history(-1);
        }
      });
  };

  const getMyDeck = () => {
    api_aw.get(`/public/decks/${deckId}`).then((response) => {
      setMyDeck(response.data);
      setDataIsLoaded(true);
    });
  };

  useEffect(() => {
    getCardTypes();
    requestPut && getMyDeck();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentArchetypeId, currentBanlistId]);

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex items-center justify-between py-2">
          <p>Création d'un deck</p>
          <p
            className="cursor-pointer"
            onClick={() => {
              history(-1);
            }}
          >
            Retour
          </p>
        </div>
        <div className="bg-red-200 w-full">
          {dataIsLoaded && (
            <Formik
              initialValues={{
                id: requestPut ? myDeck.id : null,
                isActive: requestPut ? myDeck.isActive : true,
                archetype: requestPut ? myDeck.archetype : "",
                banlist: requestPut ? myDeck.banlist : "",
                cards: requestPut ? myDeck.cards : deckCards,
                comment: requestPut ? myDeck.comment : "",
                createdAt: requestPut ? myDeck.createdAt : new Date(),
                label: requestPut ? myDeck.label : "",
                userAccount: requestPut
                  ? myDeck.userAccount
                  : { id: decoded.idUser },
              }}
              onSubmit={(values) => addDeck(values)}
            >
              <Form id="form" className="">
                <DeckSearcher
                  deckCards={deckCards}
                  setCurrentBanlistId={setCurrentBanlistId}
                  setCurrentArchetypeId={setCurrentArchetypeId}
                  myDeck
                />
                <DeckCreator
                  deckCards={deckCards}
                  setDeckCards={setDeckCards}
                  cardTypes={cardTypes}
                  archetypeCards={archetypeCards}
                  currentArchetypeId={currentArchetypeId}
                  currentBanlistId={currentBanlistId}
                  researchedCardsLabel={researchedCardsLabel}
                  setResearchedCardsLabel={setResearchedCardsLabel}
                  researchedCardsLength={researchedCardsLength}
                  setResearchedCardsLength={setResearchedCardsLength}
                />
              </Form>
            </Formik>
          )}
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default MyDeckAdd;
