import api_aw from "../api/api_aw";
import { URL_BACK_ADD_ARCHETYPE, URL_BACK_DELETE_ARCHETYPE, URL_BACK_GET_ARCHETYPE_BY_ID, URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES, URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES, URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES, URL_BACK_GET_RANDOM_ARCHETYPE, URL_BACK_RESET_POPULARITY, URL_BACK_SEARCH_ARCHETYPES, URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED, URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE, URL_BACK_SWITCH_IS_ACTIVE, URL_BACK_SWITCH_IS_HIGHLIGHTED, URL_BACK_UPDATE_ARCHETYPE } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_ARCHETYPES, URL_FRONT_ARCHETYPE } from "../constant/urlsFront";

export const getArchetypesWithCriteria = (criteria, setArchetypes, setPagination) => {
    api_aw
        .get(
            URL_BACK_SEARCH_ARCHETYPES(criteria.size, criteria.page, criteria.name, criteria.era, criteria.type, criteria.attribute, criteria.summonmechanic)
        )
        .then((response) => {
            if (response.status === 200) {
                setArchetypes(response.data.data)
                setPagination(response.data.pagination);
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

export const getEightMostFamousArchetypes = (setMostFamousArchetypes, setErrorMessage) => {
    try {
        api_aw.get(URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES)
        .then((response) => {
            setMostFamousArchetypes(response.data);
        })
        .catch((error) => {
            console.log("===========!", error);
            setErrorMessage(() => "Erreur lors du chargement des données");
        });
    } catch (error) {
        throw error;
    }
};

export const getFiveRandomHighlightedArchetypes = (setRandomHighlightedArchetypes, setErrorMessage) => {
    try {
        api_aw.get(URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES).then((response) => {
            setRandomHighlightedArchetypes(response.data);
        })
        .catch((error) => {
            console.log("===========!", error);
            setErrorMessage("Erreur lors du chargement des données");
        });
    } catch (error) {
        throw error;
    }
};

export const getEightMostRecentArchetypes = (setMostRecentArchetypes, setErrorMessage) => {
    try {
        api_aw.get(URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES)
        .then((response) => {
            setMostRecentArchetypes(response.data);
        })
        .catch((error) => {
            console.log("===========!", error);
            setErrorMessage("Erreur lors du chargement des données");
        });
    } catch (error) {
        console.log("===========!!", error);
        throw error;
    }
};

export const getRandomArchetype = (navigate) => {
    try {
        api_aw.get(URL_BACK_GET_RANDOM_ARCHETYPE).then((response) => {
            navigate(URL_FRONT_ARCHETYPE(response.data.id));
        });
    } catch (error) {
        console.log(error);
    }
};

// ADD

export const addArchetype = (newArchetype, navigate) => {
    console.log("icii", newArchetype);
    try {
        api_aw.post(URL_BACK_ADD_ARCHETYPE, newArchetype).then((response) => {
            if (response.status === 201) {
                navigate(URL_FRONT_ADMIN_ARCHETYPES);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// PUT

export const updateArchetype = (archetypeId, archetype, navigate, toast) => {
    try {
        api_aw
            .put(URL_BACK_UPDATE_ARCHETYPE(archetypeId), archetype)
            .then((response) => {
                if (response.status === 200) {
                    navigate(URL_FRONT_ADMIN_ARCHETYPES);
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Une erreur est survenue lors de la mise à jour de l'archetype");
                }
                toast.error(error.response.data.message);
            });
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
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
