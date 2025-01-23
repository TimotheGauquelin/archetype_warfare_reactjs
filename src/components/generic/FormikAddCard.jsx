import React, { useEffect, useState } from "react";
import api_aw from "../../api/api_aw";
import AdminResearcherCards from "../pages/admin/AdminResearcherCards";

const FormikAddCard = ({
  banlist,
  archetypeCards,
  setArchetypeCards,
  cards,
  setCardsRefresh,
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [researchedCardsFromInput, setResearchedCardsFromInput] = useState([]);
  const [researchedCardsLength, setResearchedCardsLength] = useState(0);
  const [researchedCardsLabel, setResearchedCardsLabel] = useState("");
  const [pagination, setPagination] = useState(0);
  const [isLoad, setIsLoad] = useState(false);

  value = cards?.length > 0 ? cards : [];

  const getCards = () => {
    api_aw
      .get(
        `/public/cardsWithCriteria?size=30&page=${pagination}&name=${researchedCardsLabel}`
      )
      .then((response) => {
        if (response.status === 200) {
          setResearchedCardsLength(response.headers["x-total-count"]);
          setResearchedCardsFromInput(response.data);
          setIsLoad(true);
        }
      });
  };

  const increasePage = () => {
    if (pagination < researchedCardsLength / 20 - 1) {
      setPagination(pagination + 1);
    }
  };

  const decreasePage = () => {
    if (pagination > 0) {
      setPagination(pagination - 1);
    }
  };

  useEffect(() => {
    getCards();
  }, [researchedCardsLabel, pagination]);

  return isLoad ? (
    <div className="col-span-3 grid grid-cols-12 mt-2">
      <AdminResearcherCards
        researchedCards={researchedCardsFromInput}
        pagination={pagination}
        setPagination={setPagination}
        setResearchedCardsLabel={setResearchedCardsLabel}
        name={name}
        setFieldValue={setFieldValue}
        archetypeCards={archetypeCards}
        setArchetypeCards={setArchetypeCards}
        increasePage={increasePage}
        decreasePage={decreasePage}
        researchedCardsLength={researchedCardsLength}
        banlist={banlist}
        setCardsRefresh={setCardsRefresh}
      />
    </div>
  ) : (
    <div>
      <p>En chargement</p>
    </div>
  );
};

export default FormikAddCard;
