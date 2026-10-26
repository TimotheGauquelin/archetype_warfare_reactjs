import React, { useMemo } from "react";
import { SwitchInput } from "../../../generic/form/SwitchInput";
import { Input } from "../../../generic/form/input/Input";
import { CheckboxInput } from "../../../generic/form/CheckboxInput";
import TextArea from "../../../generic/form/textArea/TextArea";
import { convertBase64 } from "../../../../utils/img/convertBase";
import { summonMechanicsToFrench } from "../../../../utils/trad/summonMechanics";
import { monsterTypeToFrench } from "../../../../utils/trad/monsterType";
import { attributeToFrench } from "../../../../utils/trad/attribute";
import type { Archetype } from "../../../../types";

interface Option {
  id: number;
  label: string;
}

interface AdminArchetypeDataProps {
  eras: Option[];
  attributes: Option[];
  types: Option[];
  summonMechanics: Option[];
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
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

const AdminArchetypeData: React.FC<AdminArchetypeDataProps> = ({
  eras,
  attributes,
  types,
  summonMechanics,
  newArchetype,
  setNewArchetype,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const cardCount = newArchetype.cards?.length ?? 0;
  const hasValidSlider = Boolean(newArchetype.slider_img_url?.trim());
  const canHighlight = Boolean(newArchetype.is_highlighted) || hasValidSlider;
  const canGoOnline = Boolean(newArchetype.is_active) || cardCount >= 5;

  const sortedTypes = useMemo(
    () => sortByTranslatedLabel(types, monsterTypeToFrench),
    [types]
  );
  const sortedAttributes = useMemo(
    () => sortByTranslatedLabel(attributes, attributeToFrench),
    [attributes]
  );

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">
            Informations générales
          </h2>
          <div className="flex justify-center items-center gap-2">
            <SwitchInput
              label="Slider"
              attribute="is_highlighted"
              data={newArchetype}
              setAction={setNewArchetype}
              disabled={!canHighlight}
            />
            <SwitchInput
              label="En ligne"
              attribute="is_active"
              data={newArchetype}
              setAction={setNewArchetype}
              disabled={!canGoOnline}
            />
          </div>
        </div>

        <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
          <Input
            label="Nom"
            required
            inputType="text"
            inputName="nom"
            colSpanWidth="6"
            attribute="name"
            data={newArchetype}
            setAction={setNewArchetype}
          />
          <div className="flex flex-col col-span-3">
            <label className="mt-2 font-bold">
              <span>Ère:</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              className={selectClass}
              name="era"
              value={newArchetype.era?.id || ""}
              onChange={(e) => {
                const selectedOption = eras.find(
                  (option: Option) => option.id === Number(e.target.value)
                );
                setNewArchetype((prevState: Archetype) => ({
                  ...prevState,
                  era: selectedOption
                    ? { id: selectedOption.id, label: selectedOption.label }
                    : undefined,
                }));
              }}
            >
              <option value="" disabled>
                -- Choisir une ère --
              </option>
              {eras.map((option: Option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Point de popularité"
            required
            inputType="number"
            inputName="popularityPoll"
            colSpanWidth="3"
            attribute="popularity_poll"
            min={0}
            data={newArchetype}
            setAction={setNewArchetype}
          />
        </div>

        <div className="tablet:grid tablet:grid-cols-12 tablet:gap-4">
          <Input
            label="Date d'apparition TCG"
            required
            inputType="date"
            inputName="inTCGDate"
            colSpanWidth="6"
            attribute="in_tcg_date"
            min="2002-01-01"
            max={today}
            data={newArchetype}
            setAction={setNewArchetype}
          />
          <Input
            label="Date d'apparition AW"
            required
            inputType="date"
            inputName="inAWDate"
            colSpanWidth="6"
            attribute="in_aw_date"
            min="2025-01-01"
            max={today}
            data={newArchetype}
            setAction={setNewArchetype}
          />
        </div>

        <TextArea
          label="Information principale"
          required
          value={newArchetype.main_info ?? ""}
          onChange={(e) =>
            setNewArchetype((prev) => ({
              ...prev,
              main_info: e.target.value,
            }))
          }
        />
        <TextArea
          label="Information slider"
          required
          value={newArchetype.slider_info ?? ""}
          onChange={(e) =>
            setNewArchetype((prev) => ({
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
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-lg text-gray-900">Traduction EN</h2>
        <Input
          label="Nom (EN)"
          inputType="text"
          inputName="nameEn"
          colSpanWidth="12"
          attribute="name_en"
          data={newArchetype}
          setAction={setNewArchetype}
        />
        <TextArea
          label="Information principale (EN)"
          required={false}
          value={(newArchetype as { main_info_en?: string }).main_info_en ?? ""}
          onChange={(e) =>
            setNewArchetype((prev) => ({
              ...prev,
              main_info_en: e.target.value,
            }))
          }
        />
        <TextArea
          label="Information slider (EN)"
          required={false}
          value={
            (newArchetype as { slider_info_en?: string }).slider_info_en ?? ""
          }
          onChange={(e) =>
            setNewArchetype((prev) => ({
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
          data={newArchetype}
          setAction={setNewArchetype}
        />
      </div>

      <div className="bg-gray-100 rounded p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-lg text-gray-900">
          Caractéristiques de jeu
        </h2>
        <CheckboxInput
          label="Mecanique d'invocation"
          required
          options={summonMechanics}
          attribute="summon_mechanics"
          data={newArchetype}
          setAction={setNewArchetype}
          translateLabel={summonMechanicsToFrench}
        />
        <CheckboxInput
          label="Types"
          required
          options={sortedTypes}
          attribute="types"
          data={newArchetype}
          setAction={setNewArchetype}
          translateLabel={monsterTypeToFrench}
        />
        <CheckboxInput
          label="Attributs"
          required
          options={sortedAttributes}
          attribute="attributes"
          data={newArchetype}
          setAction={setNewArchetype}
          translateLabel={attributeToFrench}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="border border-gray-200 col-span-12 tablet:col-span-6 bg-gray-100 rounded p-3 space-y-3">
          <p className="font-bold text-gray-800">Image du jumbotron</p>
          {newArchetype.slider_img_url && (
            <img
              src={newArchetype.slider_img_url}
              alt="Prévisualisation jumbotron"
              className="max-h-40 rounded object-contain shadow-sm"
            />
          )}
          <label className="flex flex-col text-sm font-bold text-gray-800">
            Fichier image
            <input
              type="file"
              accept="image/*"
              className="mt-1 font-normal"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  setNewArchetype((prevState: Archetype) => ({
                    ...prevState,
                    slider_img_url:
                      typeof base64Img === "string" ? base64Img : undefined,
                  }));
                }
              }}
            />
          </label>
          {newArchetype.slider_img_url && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline text-left"
              onClick={() =>
                setNewArchetype((prev) => ({
                  ...prev,
                  slider_img_url: "",
                }))
              }
            >
              Retirer l&apos;image
            </button>
          )}
        </div>

        <div className="border border-gray-200 col-span-12 tablet:col-span-6 bg-gray-100 rounded p-3 space-y-3">
          <p className="font-bold text-gray-800">Image de la carte</p>
          {newArchetype.card_img_url && (
            <img
              src={newArchetype.card_img_url}
              alt="Prévisualisation carte"
              className="max-h-40 rounded object-contain shadow-sm"
            />
          )}
          <label className="flex flex-col text-sm font-bold text-gray-800">
            Fichier image
            <input
              type="file"
              accept="image/*"
              className="mt-1 font-normal"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64Img = await convertBase64(file);
                  setNewArchetype((prevState: Archetype) => ({
                    ...prevState,
                    card_img_url:
                      typeof base64Img === "string" ? base64Img : undefined,
                  }));
                }
              }}
            />
          </label>
          {newArchetype.card_img_url && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline text-left"
              onClick={() =>
                setNewArchetype((prev) => ({
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

export default AdminArchetypeData;
