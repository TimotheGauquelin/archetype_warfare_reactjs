import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
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
import { Input } from "../../../generic/form/input/Input";
import SelectInput from "../../../generic/form/SelectInput";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import type { SearchCriteria, SetStateCallback } from "../../../../types";
import { FaEyeSlash, FaImage, FaRedo } from "react-icons/fa";

interface Option {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface AdminArchetypeFilterProps {
  resetAllFilters: () => void;
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

type FilterForm = SearchCriteria & Record<string, unknown>;

const AdminArchetypeFilter: React.FC<AdminArchetypeFilterProps> = ({
  resetAllFilters,
  criteria,
  setCriteria,
  setRefresh,
}) => {
  const [eras, setEras] = useState<Option[]>([]);
  const [types, setTypes] = useState<Option[]>([]);
  const [attributes, setAttributes] = useState<Option[]>([]);
  const [summonMechanics, setSummonMechanics] = useState<Option[]>([]);
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);

  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  useEffect(() => {
    getEras(setEras as SetStateCallback<Option[]>);
    getSummonMechanics(setSummonMechanics as SetStateCallback<Option[]>);
    getTypes(setTypes as SetStateCallback<Option[]>);
    getAttributes(setAttributes as SetStateCallback<Option[]>);
  }, []);

  const eraOptions = useMemo(
    () => eras.map((era) => ({ id: String(era.id), label: era.label })),
    [eras]
  );

  const attributeOptions = useMemo(
    () =>
      attributes.map((attribute) => ({
        id: attribute.label,
        label: attributeToFrench(attribute.label),
      })),
    [attributes]
  );

  const typeOptions = useMemo(
    () =>
      types.map((type) => ({
        id: type.label,
        label: monsterTypeToFrench(type.label),
      })),
    [types]
  );

  const summonMechanicOptions = useMemo(
    () =>
      summonMechanics.map((sm) => ({
        id: sm.label,
        label: summonMechanicsToFrench(sm.label),
      })),
    [summonMechanics]
  );

  const filterData = criteria as FilterForm;
  const setFilterData = setCriteria as React.Dispatch<
    React.SetStateAction<FilterForm>
  >;

  const handleResetAllFiltersButton = () => {
    showConfirmDialog({
      title: "Confirmer la réinitialisation des filtres",
      message:
        "Êtes-vous sûr de vouloir réinitialiser tous les filtres de recherche ?",
      onConfirm: () => {
        resetAllFilters();
      },
    });
  };

  const handleResetPopularityPointsToZeroButton = () => {
    showConfirmDialog({
      title: "Confirmer la réinitialisation des points de popularité",
      message:
        "Êtes-vous sûr de vouloir réinitialiser les points de popularité de tous les archétypes ?",
      onConfirm: () => {
        resetPositionOfAllArchetypes(setRefresh);
        toast.success("Points de popularité remis à zéro");
      },
    });
  };

  const handleResetAllArchetypesToIsUnactiveButton = () => {
    showConfirmDialog({
      title: 'Confirmer la désactivation du statut "En Ligne"',
      message:
        'Êtes vous sûr de vouloir mettre tous les archétypes en "Hors-ligne" ?',
      onConfirm: () => {
        switchAllArchetypesToIsUnactive(setRefresh);
        toast.success("Tous les archétypes sont hors-ligne");
      },
    });
  };

  const handleResetAllArchetypesToIsNotHighlightedButton = () => {
    showConfirmDialog({
      title: 'Confirmer la désactivation du statut "Mis en Lumière"',
      message:
        "Êtes vous sûr de ne plus vouloir afficher tous les archétypes 'Mis en Lumière' dans le slider de page d'accueil?",
      onConfirm: () => {
        switchHighlightedOfAllArchetypesToFalse(setRefresh);
        toast.success("Aucun archétype n'est plus mis en lumière");
      },
    });
  };

  return (
    <div className="border border-gray-200 bg-slate-100 rounded p-2">
      <div className="flex justify-between">
        <h2 className="text-md font-semibold">Filtres : </h2>
        <div className="flex flex-col items-center gap-2">
          <p
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleResetAllFiltersButton()}
          >
            Reset les filtres
          </p>
          <p
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => {
              setDisplayGeneralActions(!displayGeneralActions);
            }}
          >
            Actions générales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-end pt-2">
        <Input
          attribute="name"
          data={filterData}
          setAction={setFilterData}
          placeholder="Quel archetype recherchez-vous ?"
          inputType="text"
          colSpanWidth="3"
        />
        <SelectInput
          attribute="era"
          data={filterData}
          setAction={setFilterData}
          defaultOptionLabel="-- Aucune Ère --"
          options={eraOptions}
          colSpanWidth="2"
          ariaLabel="Ère"
        />
        <SelectInput
          attribute="attribute"
          data={filterData}
          setAction={setFilterData}
          defaultOptionLabel="-- Aucun Attribut --"
          options={attributeOptions}
          colSpanWidth="2"
          ariaLabel="Attribut"
        />
        <SelectInput
          attribute="type"
          data={filterData}
          setAction={setFilterData}
          defaultOptionLabel="-- Aucun Type --"
          options={typeOptions}
          colSpanWidth="2"
          ariaLabel="Type"
        />
        <SelectInput
          attribute="summonmechanic"
          data={filterData}
          setAction={setFilterData}
          defaultOptionLabel="-- Aucune Méthode d'invocation --"
          options={summonMechanicOptions}
          colSpanWidth="2"
          ariaLabel="Méthode d'invocation"
        />
      </div>

      {displayGeneralActions && (
        <div className="flex flex-wrap bg-white border border-gray-200 rounded-lg p-2 mt-2 gap-2">
          <button
            type="button"
            className="flex items-center bg-orange-100 hover:bg-orange-200 p-1 rounded text-orange-500 font-semibold"
            onClick={handleResetAllArchetypesToIsNotHighlightedButton}
          >
            <FaImage className="mr-2" />
            Retirer tous les archétypes du slider
          </button>
          <button
            type="button"
            className="flex items-center bg-red-100 hover:bg-red-200 p-1 rounded text-red-500 font-semibold"
            onClick={handleResetAllArchetypesToIsUnactiveButton}
          >
            <FaEyeSlash className="mr-2" />
            Mettre tous les archétypes hors-ligne
          </button>
          <button
            type="button"
            className="flex items-center bg-amber-100 hover:bg-amber-200 p-1 rounded text-amber-700 font-semibold"
            onClick={handleResetPopularityPointsToZeroButton}
          >
            <FaRedo className="mr-2" />
            Remettre les points de popularité à 0
          </button>
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
