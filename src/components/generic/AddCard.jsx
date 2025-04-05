import React, { useEffect, useState } from "react";
import api_aw from "../../api/api_aw";
import AdminResearcherCards from "../pages/admin/AdminResearcherCards";

const AddCard = ({newArchetype, setNewArchetype}) => {
  const [cards, setCards] = useState([]);
  const [criteria, setCriteria] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(20)

  const getCards = () => {
    api_aw
      .get(
        `/cards/search?size=${size}&page=${page}&name=${criteria}`
      )
      .then((response) => {
        if (response.status === 200) {
          setCards(response.data);
        }
      });
  };

  const increasePage = () => {
    if (cards.currentPage < cards.totalPages) {
      setPage(cards.currentPage + 1);
    }
  };

  const decreasePage = () => {
    if (cards.currentPage > 1) {
      setPage(cards.currentPage - 1);
    }
  };

  useEffect(() => {
    getCards();
    // setIsLoad(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria, page]);

  return (
    <div className="col-span-4 grid grid-cols-12 mt-2">
      <AdminResearcherCards
        researchedCards={cards}
        researchName={criteria}
        setResearchName={setCriteria}
        setPage={setPage}
        increasePage={increasePage}
        decreasePage={decreasePage}
        totalCardsNumber={cards.totalItems}
        currentPage={cards.currentPage}
        totalPages={cards.totalPages}
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
      />
    </div>
  )
};

export default AddCard;
