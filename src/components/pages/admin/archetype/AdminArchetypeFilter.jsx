import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api_aw from "../../../../api/api_aw";

const AdminArchetypeFilter = ({
  resetAllFilters,
  criteriaName,
  setCriteriaName,
  criteriaEra,
  setCriteriaEra,
  criteriaAttribute,
  setCriteriaAttribute,
  criteriaType,
  setCriteriaType,
  criteriaSummonMechanic,
  setCriteriaSummonMechanic,
  setRefresh,
}) => {
  const [eras, setEras] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);

  const getAllGenericData = () => {
    axios
      .all([
        api_aw.get(`/public/eras`),
        api_aw.get(`/public/attributes`),
        api_aw.get(`/public/types`),
        api_aw.get(`/public/summonMechanics`),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200) {
          setEras(respArr[0].data);
        }
        if (respArr[1].status === 200) {
          setAttributes(respArr[1].data);
        }
        if (respArr[2].status === 200) {
          setTypes(respArr[2].data);
        }
        if (respArr[3].status === 200) {
          setSummonMechanics(respArr[3].data);
        }
      });
  };

  const switchHighlightedOfAllArchetypesToFalse = () => {
    api_aw
      .put(`/public/archetypes/switchHighlightedOfAllArchetypesToFalse`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
          toast.success(
            `Vous avez mis tous les archétypes en mode non-affiché dans le slider.`
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const switchAllArchetypesToIsUnactive = () => {
    api_aw
      .put(`/public/archetypes/switchAllArchetypesToIsUnactive`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
          toast.success(`Vous avez mis tous les archétypes en mode inactif.`);
        }
      })
      .catch((error) => console.log(error));
  };

  const resetPositionOfAllArchetypes = () => {
    api_aw
      .put(`/public/archetypes/resetPopularityOfAllArchetypes`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
          toast.success(
            `Vous avez mis à zéro la popularité de tous les archetypes.`
          );
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllGenericData();
  }, []);

  return (
    <div className="bg-slate-200 rounded p-2">
      <div className="flex justify-between">
        <h2>Filtres : </h2>
        <p
          className="hover:text-red-500 cursor-pointer"
          onClick={() => {
            resetAllFilters();
          }}
        >
          Reset les filtres
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-12 col-span-12 pt-4 gap-4 flex justify-center items-center">
          <input
            className="col-span-2 p-2 rounded"
            placeholder="Quel archetype recherchez-vous ?"
            type="text"
            value={criteriaName}
            onChange={(e) => {
              setCriteriaName(e.target.value);
            }}
          />
          <select
            value={criteriaEra}
            className="col-span-2 p-2 rounded"
            onChange={(e) => setCriteriaEra(e.target.value)}
          >
            <option value="" defaultChecked>
              -- Aucune Ere --
            </option>
            {eras.map((era, index) => {
              return (
                <option key={index} value={era.label}>
                  {era.label}
                </option>
              );
            })}
          </select>
          <select
            value={criteriaAttribute}
            className="col-span-2 p-2 rounded"
            onChange={(e) => setCriteriaAttribute(e.target.value)}
          >
            <option value="" defaultChecked>
              -- Aucun Attribut --
            </option>
            {attributes.map((attribute, index) => {
              return (
                <option key={index} value={attribute.label}>
                  {attribute.label}
                </option>
              );
            })}
          </select>
          <select
            value={criteriaType}
            className="col-span-2 p-2 rounded"
            onChange={(e) => setCriteriaType(e.target.value)}
          >
            <option value="" defaultChecked>
              -- Aucun Type --
            </option>
            {types.map((type, index) => {
              return (
                <option key={index} value={type.label}>
                  {type.label}
                </option>
              );
            })}
          </select>
          <select
            value={criteriaSummonMechanic}
            className="col-span-2 p-2 rounded"
            onChange={(e) => setCriteriaSummonMechanic(e.target.value)}
          >
            <option value="" defaultChecked>
              -- Aucune Méthode d'invocation --
            </option>
            {summonMechanics.map((sm, index) => {
              return (
                <option key={index} value={sm.label}>
                  {sm.label}
                </option>
              );
            })}
          </select>
          <p
            className="col-span-2 flex flex-row-reverse	hover:text-red-500 cursor-pointer"
            onClick={() => {
              setDisplayGeneralActions(!displayGeneralActions);
            }}
          >
            Actions générales
          </p>
        </div>
      </div>
      {displayGeneralActions && (
        <div>
          <div className="bg-slate-200 rounded p-2">
            <div className="flex items-center">
              <p>
                Mettre tous les archétypes en "Non affiché dans le slider" :
              </p>
              <button
                className="bg-red-200 p-1 ml-2 rounded text-white hover:bg-red-300"
                onClick={() => {
                  switchHighlightedOfAllArchetypesToFalse();
                }}
              >
                Activer !
              </button>
            </div>
          </div>
          <div className="bg-slate-200 rounded p-2">
            <div className="flex items-center">
              <p>Mettre tous les archétypes en "Hors-ligne" :</p>
              <button
                className="bg-red-200 p-1 ml-2 rounded text-white hover:bg-red-300"
                onClick={() => {
                  switchAllArchetypesToIsUnactive();
                }}
              >
                Activer !
              </button>
            </div>
          </div>
          <div className="bg-slate-200 rounded p-2">
            <div className="flex items-center">
              <p>Remettre la position de tous les archétypes à 0 :</p>
              <button
                className="bg-red-200 p-1 ml-2 rounded text-white hover:bg-red-300"
                onClick={() => {
                  resetPositionOfAllArchetypes();
                }}
              >
                Activer !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArchetypeFilter;
