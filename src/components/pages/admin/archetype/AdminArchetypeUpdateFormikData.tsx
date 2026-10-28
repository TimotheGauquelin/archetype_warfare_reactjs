import { useMemo } from "react";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/input/Input";
import { CheckboxInput } from "../../../generic/form/CheckboxInput";
import { DateInput } from "../../../generic/form/DateInput";
import TextArea from "../../../generic/form/textArea/TextArea";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import { convertBase64 } from "../../../../utils/img/convertBase";
import type { Archetype } from "../../../../types";

interface Option {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface AdminArchetypeUpdateFormikDataProps {
  eras: Option[];
  attributes: Option[];
  types: Option[];
  summonMechanics: Option[];
  archetype: Archetype;
  setArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  activeTab: string;
}

const selectClass =
  "mt-2 h-full p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none w-full";

const sortByTranslatedLabel = (
  options: Option[],
  translate: (label: string) => string
) =>
  [...options].sort((a, b) =>
    translate(a.label).localeCompare(translate(b.label), "fr", {
      sensitivity: "base",
    })
  );

const AdminArchetypeUpdateFormikData: React.FC<
  AdminArchetypeUpdateFormikDataProps
> = ({
  eras,
  attributes,
  types,
  summonMechanics,
  archetype,
  setArchetype,
  activeTab,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const cardCount = archetype.cards?.length ?? 0;
  const hasValidSlider = Boolean(archetype.slider_img_url?.trim());
  const canHighlight = Boolean(archetype.is_highlighted) || hasValidSlider;
  const canGoOnline = Boolean(archetype.is_active) || cardCount >= 5;

  const sortedTypes = useMemo(
    () => sortByTranslatedLabel(types, monsterTypeToFrench),
    [types]
  );
  const sortedAttributes = useMemo(
    () => sortByTranslatedLabel(attributes, attributeToFrench),
    [attributes]
  );

  return (
    <div
      className={`space-y-4 ${activeTab === "informations" ? "" : "hidden"}`}
    >
      <div className="bg-gray-100 rounded p-2.5 tablet:p-3 flex flex-col gap-2">
        <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-center gap-2">
          <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
            Informations générales
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <SwitchInput
              label="Slider"
              attribute="is_highlighted"
              data={archetype}
              setAction={setArchetype}
              condition="put"
              disabled={!canHighlight}
            />
            <SwitchInput
              label="En ligne"
              attribute="is_active"
              data={archetype}
              setAction={setArchetype}
              condition="put"
              disabled={!canGoOnline}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 tablet:gap-4">
          <div className="col-span-12 tablet:col-span-6">
            <Input
              label="Nom"
              required
              inputType="text"
              inputName="nom"
              colSpanWidth="12"
              attribute="name"
              data={archetype}
              setAction={setArchetype}
              condition="put"
            />
          </div>
          <div className="col-span-12 tablet:col-span-3 flex flex-col">
            <label className="mt-2 font-bold">
              <span>Ère:</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              className={selectClass}
              value={archetype?.era?.id ?? ""}
              onChange={(e) => {
                setArchetype((prevState: Archetype) => ({
                  ...prevState,
                  era_id: Number(e.target.value),
                }));
              }}
            >
              <option value="" disabled>
                -- Choisir une ère --
              </option>
              {eras?.map((option: Option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 tablet:col-span-3">
            <Input
              label="Point de popularité"
              required
              inputType="number"
              inputName="popularityPoll"
              colSpanWidth="12"
              attribute="popularity_poll"
              data={archetype}
              setAction={setArchetype}
              condition="put"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 tablet:gap-4">
          <div className="col-span-12 tablet:col-span-6">
            <DateInput
              label="Date d'apparition en TCG"
              required
              inputType="date"
              inputName="inTCGDate"
              colSpanWidth="12"
              attribute="in_tcg_date"
              data={archetype as Record<string, unknown>}
              min="2002-01-01"
              max={today}
              setAction={
                setArchetype as React.Dispatch<
                  React.SetStateAction<Record<string, unknown>>
                >
              }
              condition="put"
            />
          </div>
          <div className="col-span-12 tablet:col-span-6">
            <DateInput
              label="Date d'apparition AW"
              required
              inputType="date"
              inputName="inAWDate"
              colSpanWidth="12"
              attribute="in_aw_date"
              data={archetype as Record<string, unknown>}
              min="2025-01-01"
              max={today}
              setAction={
                setArchetype as React.Dispatch<
                  React.SetStateAction<Record<string, unknown>>
                >
              }
              condition="put"
            />
          </div>
        </div>

        <TextArea
          label="Information principale"
          required
          value={archetype.main_info ?? ""}
          onChange={(e) =>
            setArchetype((prev) => ({
              ...prev,
              main_info: e.target.value,
            }))
          }
        />
        <TextArea
          label="Information slider"
          required
          value={archetype.slider_info ?? ""}
          onChange={(e) =>
            setArchetype((prev) => ({
              ...prev,
              slider_info: e.target.value,
            }))
          }
        />
        <Input
          label="Commentaire"
          inputType="text"
          inputName="comment"
          colSpanWidth="12"
          attribute="comment"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
      </div>

      <div className="bg-gray-100 rounded p-2.5 tablet:p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-base tablet:text-lg text-gray-900">Traduction EN</h2>
        <Input
          label="Nom (EN)"
          inputType="text"
          inputName="nameEn"
          colSpanWidth="12"
          attribute="name_en"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
        <TextArea
          label="Information principale (EN)"
          required={false}
          value={(archetype as { main_info_en?: string }).main_info_en ?? ""}
          onChange={(e) =>
            setArchetype((prev) => ({
              ...prev,
              main_info_en: e.target.value,
            }))
          }
        />
        <TextArea
          label="Information slider (EN)"
          required={false}
          value={
            (archetype as { slider_info_en?: string }).slider_info_en ?? ""
          }
          onChange={(e) =>
            setArchetype((prev) => ({
              ...prev,
              slider_info_en: e.target.value,
            }))
          }
        />
        <Input
          label="Commentaire (EN)"
          inputType="text"
          inputName="commentEn"
          colSpanWidth="12"
          attribute="comment_en"
          data={archetype}
          setAction={setArchetype}
          condition="put"
        />
      </div>

      <div className="bg-gray-100 rounded p-2.5 tablet:p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
          Caractéristiques de jeu
        </h2>
        <CheckboxInput
          label="Mecanique d'invocation"
          required
          options={summonMechanics}
          colSpanWidth="12"
          attribute="summon_mechanics"
          data={archetype}
          setAction={setArchetype}
          translateLabel={summonMechanicsToFrench}
        />
        <CheckboxInput
          label="Types"
          required
          options={sortedTypes}
          colSpanWidth="12"
          attribute="types"
          data={archetype}
          setAction={setArchetype}
          translateLabel={monsterTypeToFrench}
        />
        <CheckboxInput
          label="Attributs"
          required
          options={sortedAttributes}
          colSpanWidth="12"
          attribute="attributes"
          data={archetype}
          setAction={setArchetype}
          translateLabel={attributeToFrench}
        />
      </div>

      <div className="grid grid-cols-12 gap-2 tablet:gap-4">
        <div className="border border-gray-200 col-span-12 tablet:col-span-6 bg-gray-100 rounded p-2.5 tablet:p-3 space-y-3">
          <p className="font-bold text-gray-800">Image du jumbotron</p>
          {archetype.slider_img_url && (
            <img
              className="max-h-32 tablet:max-h-40 w-full rounded object-contain shadow-sm"
              src={archetype.slider_img_url}
              alt="Jumbotron de l'archetype"
            />
          )}
          <label className="flex flex-col text-sm font-bold text-gray-800">
            Fichier image
            <input
              className="mt-1 font-normal"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  if (base64Img && typeof base64Img === "string") {
                    setArchetype((prevState: Archetype) => ({
                      ...prevState,
                      slider_img_url: base64Img,
                    }));
                  }
                }
              }}
            />
          </label>
          {archetype.slider_img_url && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline text-left"
              onClick={() =>
                setArchetype((prev) => ({
                  ...prev,
                  slider_img_url: "",
                }))
              }
            >
              Retirer l&apos;image
            </button>
          )}
        </div>

        <div className="border border-gray-200 col-span-12 tablet:col-span-6 bg-gray-100 rounded p-2.5 tablet:p-3 space-y-3">
          <p className="font-bold text-gray-800">Image de la carte</p>
          {archetype.card_img_url && (
            <img
              className="max-h-32 tablet:max-h-40 w-full rounded object-contain shadow-sm"
              src={archetype.card_img_url}
              alt="Présentation de l'archetype"
            />
          )}
          <label className="flex flex-col text-sm font-bold text-gray-800">
            Fichier image
            <input
              className="mt-1 font-normal"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  if (base64Img && typeof base64Img === "string") {
                    setArchetype((prevState: Archetype) => ({
                      ...prevState,
                      card_img_url: base64Img,
                    }));
                  }
                }
              }}
            />
          </label>
          {archetype.card_img_url && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline text-left"
              onClick={() =>
                setArchetype((prev) => ({
                  ...prev,
                  card_img_url: "",
                }))
              }
            >
              Retirer l&apos;image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArchetypeUpdateFormikData;
