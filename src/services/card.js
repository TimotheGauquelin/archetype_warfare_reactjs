import api_aw from "../api/api_aw";

export const searchCards = (setCards, setPagination, size, page, name, card_type, level, min_atk, max_atk, min_def, max_def, attribute) => {
  api_aw.get(
    `/cards/search?size=${size ? size : ""}&page=${page ? page : ""}&name=${name ? name : ""}&card_type=${card_type ? card_type : ""}&level=${level ? level : ""}&min_atk=${min_atk ? min_atk : ""}&max_atk=${max_atk ? max_atk : ""}&min_def=${min_def ? min_def : ""}&max_def=${max_def ? max_def : ""}&attribute=${attribute ? attribute : ""}`
  )
    .then((response) => {
      if (response.status === 200) {
        setCards(response.data.data);
        setPagination(response.data.pagination)
      }
    });
};