import api_aw from "../api/api_aw";

export const searchCards = (setCards, size, page, name, card_type, level, min_atk, max_atk, min_def, max_def, attribute) => {
    api_aw.get(
        `/cards/search?size=${size}&page=${page}&name=${name}&card_type=${card_type}&level=${level}&min_atk=${min_atk}&max_atk=${max_atk}&min_def=${min_def}&max_def=${max_def}&attribute=${attribute}`
      )
      .then((response) => {
        if (response.status === 200) {
          setCards(response.data);
        }
      });
  };