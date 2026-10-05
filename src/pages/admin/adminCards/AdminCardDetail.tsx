import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getCardById, updateCardById, type CardArchetypeLink, type CardDetailResponse } from "../../../services/card";
import { URL_FRONT_ADMIN_CARDS } from "../../../constant/urlsFront";
import Loader from "../../../components/generic/Loader";
import { attributeToFrench } from "@/utils/trad/attribute";
import { cardTypeToFrench } from "@/utils/trad/cardType";
import { useCardTypes } from "../../../hooks/useCardTypes";
import { useAttributes } from "../../../hooks/useAttributes";

type LocaleTab = "fr" | "en";

type CardStatsForm = Pick<
  CardDetailResponse,
  "id" | "img_url" | "level" | "atk" | "def" | "attribute" | "card_type"
>;

type CardTextForm = Pick<CardDetailResponse, "name" | "description">;

const isSpellOrTrap = (label: string | undefined): boolean =>
  Boolean(label && /Spell|Trap/i.test(label));

const isLinkMonster = (label: string | undefined): boolean =>
  Boolean(label && /Link/i.test(label));

const isXyzMonster = (label: string | undefined): boolean =>
  Boolean(label && /XYZ/i.test(label));

const tabClass = (active: boolean) =>
  `py-2 px-4 rounded-t-md cursor-pointer ${
    active
      ? "text-blue-700 bg-blue-200 hover:bg-blue-300"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
  }`;

const AdminCardDetail = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { cardTypes } = useCardTypes();
  const { attributes } = useAttributes();

  const [activeTab, setActiveTab] = useState<LocaleTab>("fr");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState<CardStatsForm | null>(null);
  const [archetypes, setArchetypes] = useState<CardArchetypeLink[]>([]);
  const [isGeneric, setIsGeneric] = useState(false);
  const [textFr, setTextFr] = useState<CardTextForm>({ name: "", description: "" });
  const [textEn, setTextEn] = useState<CardTextForm>({ name: "", description: "" });

  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editStats, setEditStats] = useState<CardStatsForm | null>(null);
  const [editingLocale, setEditingLocale] = useState<LocaleTab | null>(null);
  const [editTextFr, setEditTextFr] = useState<CardTextForm | null>(null);
  const [editTextEn, setEditTextEn] = useState<CardTextForm | null>(null);

  const loadCard = useCallback(async () => {
    if (!cardId) {
      setError("ID de carte manquant");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsEditingStats(false);
    setEditingLocale(null);
    try {
      const [enCard, frCard] = await Promise.all([
        getCardById(cardId, "en"),
        getCardById(cardId, "fr"),
      ]);

      setStats({
        id: enCard.id,
        img_url: enCard.img_url,
        level: enCard.level,
        atk: enCard.atk,
        def: enCard.def,
        attribute: enCard.attribute,
        card_type: enCard.card_type,
      });
      setArchetypes(enCard.archetypes ?? []);
      setIsGeneric(Boolean(enCard.is_generic));
      setTextEn({ name: enCard.name, description: enCard.description ?? "" });
      setTextFr({ name: frCard.name, description: frCard.description ?? "" });
    } catch {
      setError("Carte introuvable.");
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const startEditStats = () => {
    if (!stats) return;
    setEditStats({ ...stats });
    setIsEditingStats(true);
    setEditingLocale(null);
  };

  const cancelEditStats = () => {
    setIsEditingStats(false);
    setEditStats(null);
  };

  const startEditLocale = (locale: LocaleTab) => {
    if (locale === "fr") {
      setEditTextFr({ ...textFr });
    } else {
      setEditTextEn({ ...textEn });
    }
    setEditingLocale(locale);
    setIsEditingStats(false);
  };

  const cancelEditLocale = () => {
    setEditingLocale(null);
    setEditTextFr(null);
    setEditTextEn(null);
  };

  const saveInformations = async () => {
    if (!cardId || !editStats) return;
    setIsSaving(true);
    try {
      await updateCardById(cardId, {
        level: editStats.level ?? null,
        atk: editStats.atk ?? null,
        def: editStats.def ?? null,
        attribute: editStats.attribute || null,
        card_type: editStats.card_type || null,
      });
      setStats({ ...editStats });
      setIsEditingStats(false);
      setEditStats(null);
      toast.success("Informations mises à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const saveTranslation = async (locale: LocaleTab) => {
    if (!cardId) return;
    const form = locale === "fr" ? editTextFr : editTextEn;
    if (!form?.name?.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    setIsSaving(true);
    try {
      await updateCardById(cardId, {
        name: form.name.trim(),
        description: form.description ?? null,
        locale,
      });
      if (locale === "fr") {
        setTextFr({ name: form.name.trim(), description: form.description ?? "" });
        setEditTextFr(null);
      } else {
        setTextEn({ name: form.name.trim(), description: form.description ?? "" });
        setEditTextEn(null);
      }
      setEditingLocale(null);
      toast.success(`Texte ${locale.toUpperCase()} enregistré`);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditActions = (onCancel: () => void, onSave: () => void) => (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Annuler
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );

  const displayTitle = textFr.name || textEn.name || stats?.id;

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Détail de la carte"
        catchphrase="Vérifiez toutes les informations de la carte"
        returnButton
      />

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate(URL_FRONT_ADMIN_CARDS)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Retour à la liste des cartes
          </button>
        </div>
      )}

      {!isLoading && !error && stats && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex gap-6 p-6 border-b border-gray-100">
            {stats.img_url && (
              <div className="flex-shrink-0">
                <img
                  src={stats.img_url}
                  alt={displayTitle ?? stats.id}
                  className="h-auto max-h-48 w-full rounded-lg object-contain sm:w-40"
                />
              </div>
            )}
            <div className="w-full min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{displayTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">ID : {stats.id}</p>
                </div>
                {!isEditingStats ? (
                  <button
                    type="button"
                    onClick={startEditStats}
                    className="text-sm text-gray-600 hover:underline shrink-0"
                  >
                    Modifier
                  </button>
                ) : null}
              </div>

              <div className="mt-3 text-sm">
                <span className="font-medium text-gray-500">Archétypes : </span>
                {archetypes.length === 0 && !isGeneric ? (
                  <span className="text-gray-600">Aucun</span>
                ) : (
                  <span className="text-gray-900">
                    {archetypes.map((archetype, index) => (
                      <span key={archetype.id}>
                        {index > 0 && ", "}
                        <a
                          href={`/admin/archetypes/update/${archetype.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {archetype.name}
                        </a>
                      </span>
                    ))}
                    {isGeneric && (
                      <span className="text-gray-600">
                        {archetypes.length > 0 ? " · " : ""}
                        Générique (tous les decks)
                      </span>
                    )}
                  </span>
                )}
              </div>

              {!isEditingStats ? (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 mt-4">
                  {!isSpellOrTrap(stats.card_type) && stats.level != null && (
                    <>
                      <dt className="font-medium text-gray-500">
                        {isXyzMonster(stats.card_type) ? "Rang" : "Niveau"}
                      </dt>
                      <dd className="text-gray-900">{stats.level}</dd>
                    </>
                  )}
                  {!isSpellOrTrap(stats.card_type) && stats.atk != null && (
                    <>
                      <dt className="font-medium text-gray-500">
                        {isLinkMonster(stats.card_type) ? "ATK" : "ATK/DEF"}
                      </dt>
                      <dd className="text-gray-900">
                        {isLinkMonster(stats.card_type)
                          ? stats.atk
                          : `${stats.atk}/${stats.def ?? ""}`}
                      </dd>
                    </>
                  )}
                  {!isSpellOrTrap(stats.card_type) && stats.attribute && (
                    <>
                      <dt className="font-medium text-gray-500">Attribut</dt>
                      <dd className="text-gray-900">{attributeToFrench(stats.attribute)}</dd>
                    </>
                  )}
                  {stats.card_type && (
                    <>
                      <dt className="font-medium text-gray-500">Type</dt>
                      <dd className="text-gray-900">{cardTypeToFrench(stats.card_type)}</dd>
                    </>
                  )}
                </dl>
              ) : editStats ? (
                <div className="mt-4">
                  {renderEditActions(cancelEditStats, saveInformations)}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editStats.card_type ?? ""}
                      onChange={(e) =>
                        setEditStats((prev) =>
                          prev ? { ...prev, card_type: e.target.value } : prev
                        )
                      }
                      className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-gray-900"
                    >
                      <option value="">Sélectionner un type</option>
                      {cardTypes.map((ct) => (
                        <option key={ct.id} value={ct.label}>
                          {cardTypeToFrench(ct.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!isSpellOrTrap(editStats.card_type) && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isXyzMonster(editStats.card_type) ? "Rang" : "Niveau"}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={editStats.level ?? ""}
                          onChange={(e) =>
                            setEditStats((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    level:
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value),
                                  }
                                : prev
                            )
                          }
                          className="w-full rounded border border-gray-300 px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ATK</label>
                        <input
                          type="number"
                          value={editStats.atk ?? ""}
                          onChange={(e) =>
                            setEditStats((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    atk:
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value),
                                  }
                                : prev
                            )
                          }
                          className="w-full rounded border border-gray-300 px-3 py-2"
                        />
                      </div>
                      {!isLinkMonster(editStats.card_type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">DEF</label>
                          <input
                            type="number"
                            value={editStats.def ?? ""}
                            onChange={(e) =>
                              setEditStats((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      def:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    }
                                  : prev
                              )
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attribut</label>
                        <select
                          value={editStats.attribute ?? ""}
                          onChange={(e) =>
                            setEditStats((prev) =>
                              prev ? { ...prev, attribute: e.target.value } : prev
                            )
                          }
                          className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                          <option value="">Sélectionner</option>
                          {attributes.map((attr) => (
                            <option key={attr.id} value={attr.label}>
                              {attributeToFrench(attr.label)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex">
              <span className={tabClass(activeTab === "fr")} onClick={() => setActiveTab("fr")}>
                Français
              </span>
              <span className={tabClass(activeTab === "en")} onClick={() => setActiveTab("en")}>
                Anglais
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-md border border-t-0 border-gray-200">
              {activeTab === "fr" && (
                <div>
                  {editingLocale !== "fr" ? (
                    <>
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() => startEditLocale("fr")}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          Modifier
                        </button>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{textFr.name}</h3>
                      {textFr.description && (
                        <p className="text-gray-600 whitespace-pre-wrap mt-3">{textFr.description}</p>
                      )}
                    </>
                  ) : editTextFr ? (
                    <>
                      {renderEditActions(cancelEditLocale, () => saveTranslation("fr"))}
                      <div className="space-y-4 max-w-2xl">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom (FR)</label>
                          <input
                            type="text"
                            value={editTextFr.name}
                            onChange={(e) =>
                              setEditTextFr((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev
                              )
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (FR)
                          </label>
                          <textarea
                            value={editTextFr.description ?? ""}
                            onChange={(e) =>
                              setEditTextFr((prev) =>
                                prev ? { ...prev, description: e.target.value } : prev
                              )
                            }
                            rows={8}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {activeTab === "en" && (
                <div>
                  {editingLocale !== "en" ? (
                    <>
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() => startEditLocale("en")}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          Modifier
                        </button>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{textEn.name}</h3>
                      {textEn.description && (
                        <p className="text-gray-600 whitespace-pre-wrap mt-3">{textEn.description}</p>
                      )}
                    </>
                  ) : editTextEn ? (
                    <>
                      {renderEditActions(cancelEditLocale, () => saveTranslation("en"))}
                      <div className="space-y-4 max-w-2xl">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
                          <input
                            type="text"
                            value={editTextEn.name}
                            onChange={(e) =>
                              setEditTextEn((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev
                              )
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (EN)
                          </label>
                          <textarea
                            value={editTextEn.description ?? ""}
                            onChange={(e) =>
                              setEditTextEn((prev) =>
                                prev ? { ...prev, description: e.target.value } : prev
                              )
                            }
                            rows={8}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminCardDetail;
