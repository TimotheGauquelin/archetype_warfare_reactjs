import api_aw from "../api/api_aw";

export const searchCards = (
  setCards, 
  setPagination, 
  size, 
  page, 
  name, 
  card_type, 
  level, 
  min_atk, 
  max_atk, 
  min_def, 
  max_def, 
  attribute,
  signal = null
) => {

  const params = new URLSearchParams();

  if (size) params.append("size", size);
  if (page) params.append("page", page);
  if (name) params.append("name", name);
  if (card_type) params.append("card_type", card_type);
  if (level) params.append("level", level);
  if (min_atk) params.append("min_atk", min_atk);
  if (max_atk) params.append("max_atk", max_atk);
  if (min_def) params.append("min_def", min_def);
  if (max_def) params.append("max_def", max_def);
  if (attribute) params.append("attribute", attribute);

  const config = signal ? { signal } : {};

  api_aw.get(`/cards/search?${params.toString()}`, config)
    .then((response) => {
      if (response.status === 200) {
        setCards(response.data.data || []);
        setPagination(response.data.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: page || 1,
          pageSize: size || 30,
        });
      }
    })
    .catch((error) => {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Erreur lors de la recherche de cartes:", error);
        setCards([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: page || 1,
          pageSize: size || 30,
        });
      }
    });
};

export const searchCardsWithoutArchetypeAndByOneArchetypeId = async (
  archetypeId,
  setCards, 
  setPagination, 
  size, 
  page, 
  name, 
  card_type, 
  level, 
  min_atk, 
  max_atk, 
  min_def, 
  max_def, 
  attribute,
  signal = null
) => {

  const params = new URLSearchParams();
  if (size) params.append("size", size);
  if (page) params.append("page", page);
  if (name) params.append("name", name);
  if (card_type) params.append("card_type", card_type);
  if (level) params.append("level", level);
  if (min_atk) params.append("min_atk", min_atk);
  if (max_atk) params.append("max_atk", max_atk);
  if (min_def) params.append("min_def", min_def);
  if (max_def) params.append("max_def", max_def);
  if (attribute) params.append("attribute", attribute);

  const config = signal ? { signal } : {};

  api_aw.get(`/cards/searchByArchetype/${archetypeId}?${params.toString()}`, config)
    .then((response) => {
      if (response.status === 200) {
        setCards(response.data.data || []);
        setPagination(response.data.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: page || 1,
          pageSize: size || 30,
        });
      }
    })
    .catch((error) => {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Erreur lors de la recherche de cartes:", error);
        setCards([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: page || 1,
          pageSize: size || 30,
        });
      }
    });
};