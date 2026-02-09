import api_aw from "../api/api_aw";
import { URL_BACK_ADD_ARCHETYPE, URL_BACK_DELETE_ARCHETYPE, URL_BACK_GET_ARCHETYPE_BY_ID, URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES, URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES, URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES, URL_BACK_GET_RANDOM_ARCHETYPE, URL_BACK_RESET_POPULARITY, URL_BACK_SEARCH_ARCHETYPES, URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED, URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE, URL_BACK_SWITCH_IS_ACTIVE, URL_BACK_SWITCH_IS_HIGHLIGHTED, URL_BACK_UPDATE_ARCHETYPE } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_ARCHETYPES, URL_FRONT_ARCHETYPE } from "../constant/urlsFront";
import type { Archetype, SearchCriteria, Pagination, SetStateCallback, SetErrorMessageCallback } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { NavigateFunction } from "react-router-dom";
import type { ToastFunction } from "./websiteactions";

/**
 * Searc  
 */
export const getArchetypesWithCriteria = async (
  criteria: SearchCriteria,
  setArchetypes: SetStateCallback<Archetype[]>,
  setPagination: SetStateCallback<Pagination>,
  setErrorMessage: SetErrorMessageCallback
): Promise<void> => {
  try {
    const response = await api_aw.get(
      URL_BACK_SEARCH_ARCHETYPES(
        criteria.size,
        criteria.page,
        criteria.name,
        criteria.era,
        criteria.type,
        criteria.attribute,
        criteria.summonmechanic
      )
    );

    if (response.status === 200 && response.data) {
      setArchetypes(response.data.data || []);
      setPagination(response.data.pagination || {
        total: 0,
        totalPages: 0,
        currentPage: criteria.page,
        pageSize: criteria.size,
      });
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getArchetypesWithCriteria');
    setErrorMessage("Aucun archétype trouvé");
  }
};

/**
 * Retrieve an archetype by its ID
 */
export const getArchetypeById = async (
  archetypeId: number | string,
  setArchetype: SetStateCallback<Archetype>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ARCHETYPE_BY_ID(archetypeId));
    if (response.data) {
      setArchetype(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getArchetypeById');
    throw appError;
  }
};

/**
 * Retrieve the 8 most famous archetypes
 */
export const getEightMostFamousArchetypes = async (
  setMostFamousArchetypes: SetStateCallback<Archetype[]>,
  setErrorMessage: SetErrorMessageCallback
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES);
    if (response.data) {
      setMostFamousArchetypes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getEightMostFamousArchetypes');
    setErrorMessage("Erreur lors du chargement des données");
  }
};

/**
 * Retrieve 5 random highlighted archetypes
 */
export const getFiveRandomHighlightedArchetypes = async (
  setRandomHighlightedArchetypes: SetStateCallback<Archetype[]>,
  setErrorMessage: SetErrorMessageCallback
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES);
    if (response.data) {
      setRandomHighlightedArchetypes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getFiveRandomHighlightedArchetypes');
    setErrorMessage("Erreur lors du chargement des données");
  }
};

/**
 * Retrieve the 8 most recent archetypes
 */
export const getEightMostRecentArchetypes = async (
  setMostRecentArchetypes: SetStateCallback<Archetype[]>,
  setErrorMessage: SetErrorMessageCallback
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES);
    if (response.data) {
      setMostRecentArchetypes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getEightMostRecentArchetypes');
    setErrorMessage("Erreur lors du chargement des données");
  }
};

/**
 * Retrieve a random archetype and redirect to its page
 */
export const getRandomArchetype = async (
  navigate: NavigateFunction
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_RANDOM_ARCHETYPE);
    if (response.data?.id) {
      navigate(URL_FRONT_ARCHETYPE(response.data.id));
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getRandomArchetype');
  }
};

/**
 * Retrieve all archetypes names
 */
export const getArchetypesNames = async (
  setArchetypes: SetStateCallback<Array<{ id: number; name: string }>>
): Promise<void> => {
  try {
    const response = await api_aw.get('/archetypes/allNames');
    if (response.status === 200 && response.data) {
      setArchetypes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getArchetypesNames');
  }
};

// ADD

/**
 * Ajoute un nouvel archétype
 */
export const addArchetype = async (
  newArchetype: Partial<Archetype>,
  navigate: NavigateFunction,
  toast: ToastFunction
): Promise<void> => {
  try {
    const response = await api_aw.post(URL_BACK_ADD_ARCHETYPE, newArchetype);
    if (response.status === 201) {
      navigate(URL_FRONT_ADMIN_ARCHETYPES);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'addArchetype');
    toast.error(getErrorMessage(appError));
  }
};

// PUT

/**
 * Met à jour un archétype
 */
export const updateArchetype = async (
  archetypeId: number | string,
  archetype: Partial<Archetype>,
  navigate: NavigateFunction,
  toast: ToastFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw.put(URL_BACK_UPDATE_ARCHETYPE(archetypeId), archetype);
    if (response.status === 200) {
      setIsLoading(false);
      navigate(URL_FRONT_ADMIN_ARCHETYPES);
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'updateArchetype');
    toast.error(getErrorMessage(appError));
  }
};

/**
 * Bascule l'état "mis en avant" d'un archétype
 */
export const switchIsHighlighted = async (
  archetypeId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_IS_HIGHLIGHTED(archetypeId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchIsHighlighted');
  }
};

/**
 * Bascule l'état "actif" d'un archétype
 */
export const switchIsActive = async (
  archetypeId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_IS_ACTIVE(archetypeId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchIsActive');
  }
};

// PUT ALL

/**
 * Désactive la mise en avant de tous les archétypes
 */
export const switchHighlightedOfAllArchetypesToFalse = async (
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED);
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchHighlightedOfAllArchetypesToFalse');
  }
};

/**
 * Désactive tous les archétypes
 */
export const switchAllArchetypesToIsUnactive = async (
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE);
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchAllArchetypesToIsUnactive');
  }
};

/**
 * Réinitialise la popularité de tous les archétypes
 */
export const resetPositionOfAllArchetypes = async (
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_RESET_POPULARITY);
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'resetPositionOfAllArchetypes');
  }
};

// DELETE

/**
 * Supprime un archétype
 */
export const deleteArchetype = async (
  archetypeId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.delete(URL_BACK_DELETE_ARCHETYPE(archetypeId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'deleteArchetype');
  }
};
