import React, { useEffect, useState } from "react";
import { getEras } from "../../../../services/era";
import { getSummonMechanics } from "../../../../services/summonmechanic";
import { getTypes } from "../../../../services/type";
import { getAttributes } from "../../../../services/attribute";
import {
  resetPositionOfAllArchetypes,
  switchAllArchetypesToIsUnactive,
  switchHighlightedOfAllArchetypesToFalse,
} from "../../../../services/archetype";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";

const AdminArchetypeFilter = ({
  resetAllFilters,
  criteria,
  setCriteria,
  setRefresh,
}) => {
  const [eras, setEras] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);

  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  useEffect(() => {
    getEras(setEras);
    getSummonMechanics(setSummonMechanics);
    getTypes(setTypes);
    getAttributes(setAttributes);
  }, []);

  const handleResetAllFiltersButton = () => {
    showConfirmDialog({
      title: 'Confirmer la réinitialisation des filtres',
      message: 'Êtes-vous sûr de vouloir réinitialiser tous les filtres de recherche ?',
      onConfirm: () => {
        resetAllFilters();
      },
    });
  };

  const handleResetPopularityPointsToZeroButton = () => {
    showConfirmDialog({
      title: 'Confirmer la réinitialisation des points de popularité',
      message: 'Êtes-vous sûr de vouloir réinitialiser les points de popularité de tous les archétypes ?',
      onConfirm: () => {
        resetPositionOfAllArchetypes(setRefresh);
      },
    });
  };

  const handleResetAllArchetypesToIsUnactiveButton = () => {
    showConfirmDialog({
      title: 'Confirmer la désactivation du statut "En Ligne"',
      message: 'Êtes vous sûr de vouloir mettre tous les archétypes en "Hors-ligne" ?',
      onConfirm: () => {
        switchAllArchetypesToIsUnactive(setRefresh);
      },
    });
  };

  const handleResetAllArchetypesToIsNotHighlightedButton = () => {
    showConfirmDialog({
      title: 'Confirmer la désactivation du statut "Mis en Lumière"',
      message: "Êtes vous sûr de ne plus vouloir afficher tous les archétypes 'Mis en Lumière' dans le slider de page d'accueil?",
      onConfirm: () => {
        switchHighlightedOfAllArchetypesToFalse(setRefresh);
      },
    });
  };

  return (
    <div className="bg-slate-200 rounded p-2">
      <div className="flex justify-between">
        <h2>Filtres : </h2>
        <p
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleResetAllFiltersButton()}
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
            value={criteria.name}
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                name: e.target.value,
              }));
            }}
          />
          <select
            value={criteria.era}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prevState) => ({
                ...prevState,
                era: e.target.value,
              }))
            }
          >
            <option value="" defaultChecked>
              -- Aucune Ere --
            </option>
            {eras.map((era, index) => {
              return (
                <option key={index} value={era.id}>
                  {era.label}
                </option>
              );
            })}
          </select>
          <select
            value={criteria.attribute}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prevState) => ({
                ...prevState,
                attribute: e.target.value,
              }))
            }
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
            value={criteria.type}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prevState) => ({
                ...prevState,
                type: e.target.value,
              }))
            }
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
            value={criteria.summonmechanic}
            className="col-span-2 p-2 rounded"
            onChange={(e) => {
              setCriteria((prevState) => ({
                ...prevState,
                summonmechanic: e.target.value,
              }))
            }
            }
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
                  handleResetAllArchetypesToIsNotHighlightedButton();
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
                  handleResetAllArchetypesToIsUnactiveButton();
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
                  handleResetPopularityPointsToZeroButton();
                }}
              >
                Activer !
              </button>
            </div>
          </div>
        </div>
      )}

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </div>
  );
};

export default AdminArchetypeFilter;