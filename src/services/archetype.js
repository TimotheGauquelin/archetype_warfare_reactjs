import api_aw from "../api/api_aw";
import { URL_BACK_ADD_ARCHETYPE, URL_BACK_DELETE_ARCHETYPE, URL_BACK_GET_ARCHETYPE_BY_ID, URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES, URL_BACK_GET_FIVE_MOST_FAMOUS_ARCHETYPES, URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES, URL_BACK_RESET_POPULARITY, URL_BACK_SEARCH_ARCHETYPES, URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED, URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE, URL_BACK_SWITCH_IS_ACTIVE, URL_BACK_SWITCH_IS_HIGHLIGHTED, URL_BACK_UPDATE_ARCHETYPE } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_ARCHETYPES } from "../constant/urlsFront";

export const getArchetypesWithCriteria = (size, pagination, criteria, setArchetypes) => {
    api_aw
        .get(
            URL_BACK_SEARCH_ARCHETYPES(size, pagination, criteria.name, criteria.era)
        )
        .then((response) => {
            if (response.status === 200) {
                setArchetypes(response.data)
            }
        });
};

export const getArchetypeById = (archetypeId, setArchetype) => {
    try {
        api_aw.get(URL_BACK_GET_ARCHETYPE_BY_ID(archetypeId)).then((response) => {
            setArchetype(response.data);
        });
    } catch (error) {
        console.log(error);
    }
};

export const getFiveMostFamousArchetypes = (setMostFamousArchetypes) => {
    try {
        api_aw.get(URL_BACK_GET_FIVE_MOST_FAMOUS_ARCHETYPES).then((response) => {
            setMostFamousArchetypes(response.data);
        });
    } catch (error) {
        console.log(error);
    }
};

export const getFiveRandomHighlightedArchetypes = (setRandomHighlightedArchetypes) => {
    try {
        api_aw.get(URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES).then((response) => {
            setRandomHighlightedArchetypes(response.data);
        });
    } catch (error) {
        console.log(error);
    }
};

export const getEightMostRecentArchetypes = (setMostRecentArchetypes) => {
    try {
        api_aw.get(URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES).then((response) => {
            setMostRecentArchetypes(response.data);
        });
    } catch (error) {
        console.log(error);
    }
};

// ADD

export const addArchetype = (newArchetype, navigate) => {
    try {
        api_aw.post(URL_BACK_ADD_ARCHETYPE, newArchetype).then((response) => {
            console.log(response);
            if (response.status === 201) {
                navigate(URL_FRONT_ADMIN_ARCHETYPES);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// PUT

export const updateArchetype = (archetypeId, archetype, navigate) => {
    try {
        api_aw
            .put(URL_BACK_UPDATE_ARCHETYPE(archetypeId), archetype)
            .then((response) => {
                if (response.status === 200) {
                    navigate(URL_FRONT_ADMIN_ARCHETYPES);
                }
            });
    } catch (error) {
        console.log(error);
    }
};

export const switchIsHighlighted = (archetypeId, setRefresh) => {
    api_aw
        .put(URL_BACK_SWITCH_IS_HIGHLIGHTED(archetypeId))
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
            }
        })
        .catch((error) => console.log(error));
};

export const switchIsActive = (archetypeId, setRefresh) => {
    api_aw
        .put(URL_BACK_SWITCH_IS_ACTIVE(archetypeId))
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
            }
        })
        .catch((error) => console.log(error));
};

// PUT ALL

export const switchHighlightedOfAllArchetypesToFalse = (setRefresh) => {
    api_aw
        .put(URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED)
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
            }
        })
        .catch((error) => console.log(error));
};

export const switchAllArchetypesToIsUnactive = (setRefresh) => {
    api_aw
        .put(URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE)
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
                // toast.success(`Vous avez mis tous les archétypes en mode inactif.`);
            }
        })
        .catch((error) => console.log(error));
};

export const resetPositionOfAllArchetypes = (setRefresh) => {
    api_aw
        .put(URL_BACK_RESET_POPULARITY)
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
                // toast.success(
                //     `Vous avez mis à zéro la popularité de tous les archetypes.`
                // );
            }
        })
        .catch((error) => console.log(error));
};

// DELETE

export const deleteArchetype = (archetypeId, setRefresh) => {
    api_aw
        .delete(URL_BACK_DELETE_ARCHETYPE(archetypeId))
        .then((response) => {
            if (response.status === 200) {
                setRefresh(true);
                // toast.success(`Vous avez supprimé l'archetype ${archetypeName}`);
            }
        })
        .catch((error) => console.log(error));
};
