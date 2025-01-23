/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";

const FormikCardsInput = ({ archetype }) => {
  const [archetypeCards, setArchetypeCards] = useState([]);
  const archetypeCardsId = archetype?.cards
    ?.map((card) => {
      return card.id;
    })
    .join();

  const getArchetype = () => {
    axios
      .get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${archetypeCardsId}&language=fr`
      )
      .then((response) => {
        if (response.status === 200) {
          setArchetypeCards(response?.data?.data);
        }
      });
  };

  useEffect(() => {
    if (archetype) {
      getArchetype();
    }
  }, []);

  return (
    <div className="grid grid-cols-8 gap-4">
      {archetypeCards?.map((card, index) => {
        return (
          <div key={index}>
            <img src={card?.card_images[0].image_url} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default FormikCardsInput;
