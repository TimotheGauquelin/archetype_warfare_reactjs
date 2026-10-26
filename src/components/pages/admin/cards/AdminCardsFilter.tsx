import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";
import { Input } from "../../../generic/form/input/Input";
import SelectInput from "../../../generic/form/SelectInput";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { cardTypeToFrench } from "../../../../utils/trad/cardType";
import type { CardSearchCriteria } from "../../../../types";

interface AdminCardsFilterProps {
  cardTypes: Array<{ id: number; label: string }>;
  attributes: Array<{ id: number; label: string }>;
  criteria: CardSearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<CardSearchCriteria>>;
  resetAllFilters: () => void;
  /** Sur l'ajout/modif d'archétype : 3 champs par ligne sur PC. */
  compact?: boolean;
  /** Affiche « Actions générales » (ex. vider le deck utilisateur). */
  onClearAllDeckCards?: () => void;
}

type FilterForm = CardSearchCriteria & Record<string, unknown>;

const numberInputClass =
  "mt-0 sscreen:mt-2 p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none w-full";

const AdminCardsFilter: React.FC<AdminCardsFilterProps> = ({
  cardTypes,
  attributes,
  criteria,
  setCriteria,
  resetAllFilters,
  compact = false,
  onClearAllDeckCards,
}) => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language?.startsWith("fr");
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);

  const filterData = criteria as FilterForm;
  const setFilterData = setCriteria as React.Dispatch<
    React.SetStateAction<FilterForm>
  >;

  const cardTypeOptions = useMemo(
    () =>
      cardTypes.map((cardType) => ({
        id: cardType.label,
        label: isFrench ? cardTypeToFrench(cardType.label) : cardType.label,
      })),
    [cardTypes, isFrench]
  );

  const attributeOptions = useMemo(
    () =>
      attributes.map((attribute) => ({
        id: attribute.label,
        label: isFrench
          ? attributeToFrench(attribute.label)
          : attribute.label,
      })),
    [attributes, isFrench]
  );

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

  const handleClearAllDeckCards = () => {
    if (!onClearAllDeckCards) return;
    showConfirmDialog({
      title: t("profile.clearAllDeckCardsTitle"),
      message: t("profile.clearAllDeckCardsConfirm"),
      onConfirm: () => {
        onClearAllDeckCards();
      },
    });
  };

  const setNumberField = (
    field: keyof CardSearchCriteria,
    raw: string
  ) => {
    const value = raw === "" ? undefined : Number(raw);
    setCriteria((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const setFilterWithPageReset: React.Dispatch<
    React.SetStateAction<FilterForm>
  > = (v) => {
    setFilterData((prev) => {
      const next =
        typeof v === "function"
          ? (v as (p: FilterForm) => FilterForm)(prev)
          : v;
      return { ...next, page: 1 };
    });
  };

  // Mobile : uniquement nom / niveau / type / attribut en 2×2 ; ATK/DEF masqués
  const nameWrap = compact
    ? "col-span-6 sscreen:col-span-4"
    : "col-span-6 sscreen:col-span-3";
  const levelWrap = compact
    ? "col-span-6 sscreen:col-span-4 flex flex-col"
    : "col-span-6 sscreen:col-span-1 flex flex-col";
  const atkDefWrap = compact
    ? "hidden sscreen:flex sscreen:flex-col col-span-6 sscreen:col-span-4"
    : "hidden sscreen:flex sscreen:flex-col col-span-6 sscreen:col-span-1";
  const typeWrap = compact
    ? "col-span-6 sscreen:col-span-4"
    : "col-span-6 sscreen:col-span-2";
  const attributeWrap = compact
    ? "col-span-6 sscreen:col-span-4"
    : "col-span-6 sscreen:col-span-2";

  return (
    <div className="border border-gray-200 bg-slate-100 rounded p-2">
      <div className="flex justify-between">
        <h2 className="text-md font-semibold">{t("filters.title")}</h2>
        <div className="flex flex-col items-end gap-1">
          <p
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleResetAllFiltersButton()}
          >
            {t("filters.reset")}
          </p>
          {onClearAllDeckCards && (
            <p
              className="hover:text-blue-500 cursor-pointer"
              onClick={() => setDisplayGeneralActions((prev) => !prev)}
            >
              {t("filters.generalActions")}
            </p>
          )}
        </div>
      </div>

      <div
        className={`grid grid-cols-12 items-end pt-1 sscreen:pt-2 gap-1 ${
          compact ? "sscreen:gap-2" : "sscreen:gap-4"
        } [&_input]:mt-0 sscreen:[&_input]:mt-2 [&>div>div]:mt-0 sscreen:[&>div>div]:mt-2 [&>div>div]:space-y-0`}
      >
        <div className={nameWrap}>
          <Input
            attribute="name"
            data={filterData}
            setAction={setFilterWithPageReset}
            placeholder={t("common.searchCard")}
            inputType="text"
            colSpanWidth="12"
          />
        </div>
        <div className={levelWrap}>
          <input
            className={numberInputClass}
            placeholder="Level"
            type="number"
            value={criteria.level ?? ""}
            onChange={(e) => setNumberField("level", e.target.value)}
            aria-label="Level"
          />
        </div>
        <div className={atkDefWrap}>
          <input
            className={numberInputClass}
            placeholder="Atk <"
            type="number"
            step="50"
            min="0"
            max={5000}
            value={criteria.min_atk ?? ""}
            onChange={(e) => setNumberField("min_atk", e.target.value)}
            aria-label="ATK min"
          />
        </div>
        <div className={atkDefWrap}>
          <input
            className={numberInputClass}
            placeholder="Atk >"
            type="number"
            step="50"
            min="0"
            max="5000"
            value={criteria.max_atk ?? ""}
            onChange={(e) => setNumberField("max_atk", e.target.value)}
            aria-label="ATK max"
          />
        </div>
        <div className={atkDefWrap}>
          <input
            className={numberInputClass}
            placeholder="Def <"
            type="number"
            step="50"
            min="0"
            max={5000}
            value={criteria.min_def ?? ""}
            onChange={(e) => setNumberField("min_def", e.target.value)}
            aria-label="DEF min"
          />
        </div>
        <div className={atkDefWrap}>
          <input
            className={numberInputClass}
            placeholder="Def >"
            type="number"
            step="50"
            min="0"
            max={5000}
            value={criteria.max_def ?? ""}
            onChange={(e) => setNumberField("max_def", e.target.value)}
            aria-label="DEF max"
          />
        </div>
        <div className={typeWrap}>
          <SelectInput
            attribute="card_type"
            data={filterData}
            setAction={setFilterWithPageReset}
            defaultOptionLabel={t("filters.noType")}
            options={cardTypeOptions}
            colSpanWidth="12"
            ariaLabel="Type de carte"
          />
        </div>
        <div className={attributeWrap}>
          <SelectInput
            attribute="attribute"
            data={filterData}
            setAction={setFilterWithPageReset}
            defaultOptionLabel={t("filters.noAttribute")}
            options={attributeOptions}
            colSpanWidth="12"
            ariaLabel="Attribut"
          />
        </div>
      </div>

      {onClearAllDeckCards && displayGeneralActions && (
        <div className="flex flex-wrap bg-white border border-gray-200 rounded-lg p-2 mt-2 gap-2">
          <button
            type="button"
            className="flex items-center bg-red-100 hover:bg-red-200 p-1 rounded text-red-500 font-semibold text-sm"
            onClick={handleClearAllDeckCards}
          >
            <FaTrash className="mr-2 shrink-0" />
            {t("profile.clearAllDeckCards")}
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

export default AdminCardsFilter;
