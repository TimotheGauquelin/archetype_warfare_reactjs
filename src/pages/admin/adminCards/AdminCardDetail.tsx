import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getCardById, type CardDetailResponse } from "../../../services/card";
import { URL_FRONT_ADMIN_CARDS } from "../../../constant/urlsFront";
import Loader from "../../../components/generic/Loader";
import { attributeToFrench } from "@/utils/trad/attribute";
import { cardTypeToFrench } from "@/utils/trad/cardType";
import { useCardTypes } from "../../../hooks/useCardTypes";
import { useAttributes } from "../../../hooks/useAttributes";

const isSpellOrTrap = (label: string | undefined): boolean =>
  Boolean(label && /Spell|Trap/i.test(label));

const isLinkMonster = (label: string | undefined): boolean =>
  Boolean(label && /Link/i.test(label));

const isXyzMonster = (label: string | undefined): boolean =>
  Boolean(label && /XYZ/i.test(label));

const AdminCardDetail = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { cardTypes } = useCardTypes();
  const { attributes } = useAttributes();
  const [card, setCard] = useState<CardDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CardDetailResponse | null>(null);

  const loadCard = useCallback(async () => {
    if (!cardId) {
      setError("ID de carte manquant");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCardById(cardId);
      setCard(data);
    } catch {
      setError("Carte introuvable.");
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const handleStartEdit = () => {
    if (card) {
      setEditForm({ ...card });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleEditChange = <K extends keyof CardDetailResponse>(
    field: K,
    value: CardDetailResponse[K]
  ) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

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

      {!isLoading && !error && card && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex gap-6 sm:flex-row">
            {card.img_url && (
              <div className="flex-shrink-0">
                <img
                  src={card.img_url}
                  alt={card.name}
                  className="h-auto max-h-96 w-full rounded-lg object-contain sm:w-64"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                {!isEditing ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">{card.name}</h2>
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="text-gray-600 text-sm cursor-pointer hover:opacity-80 transition-opacity hover:underline"
                    >
                      Modifier
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <>
                  {card.description && (
                    <p className="text-gray-600 whitespace-pre-wrap">{card.description}</p>
                  )}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    {!isSpellOrTrap(card.card_type) && card.level != null && (
                      <>
                        <dt className="font-medium text-gray-500">{isXyzMonster(card.card_type) ? "Rang" : "Niveau"}</dt>
                        <dd className="text-gray-900">{card.level}</dd>
                      </>
                    )}
                    {!isSpellOrTrap(card.card_type) && card.atk != null && (
                      <>
                        <dt className="font-medium text-gray-500">{isLinkMonster(card.card_type) ? "ATK" : "ATK/DEF"}</dt>
                        <dd className="text-gray-900">{isLinkMonster(card.card_type) ? card.atk : `${card.atk}/${card.def ?? ""}`}</dd>
                      </>
                    )}
                    {!isSpellOrTrap(card.card_type) && card.attribute && (
                      <>
                        <dt className="font-medium text-gray-500">Attribut</dt>
                        <dd className="text-gray-900">{attributeToFrench(card.attribute)}</dd>
                      </>
                    )}
                    {card.card_type && (
                      <>
                        <dt className="font-medium text-gray-500">Type</dt>
                        <dd className="text-gray-900">{cardTypeToFrench(card.card_type)}</dd>
                      </>
                    )}
                    <dt className="font-medium text-gray-500">ID</dt>
                    <dd className="text-gray-900">{card.id}</dd>
                  </dl>
                </>
              ) : editForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editForm.name ?? ""}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description ?? ""}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      rows={4}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editForm.card_type ?? ""}
                      onChange={(e) => handleEditChange("card_type", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un type</option>
                      {cardTypes.map((ct) => (
                        <option key={ct.id} value={ct.label}>
                          {cardTypeToFrench(ct.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!isSpellOrTrap(editForm.card_type) && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isXyzMonster(editForm.card_type) ? "Rang" : "Niveau"}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={editForm.level ?? ""}
                          onChange={(e) => handleEditChange("level", e.target.value === "" ? undefined : Number(e.target.value))}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ATK</label>
                        <input
                          type="number"
                          value={editForm.atk ?? ""}
                          onChange={(e) => handleEditChange("atk", e.target.value === "" ? undefined : Number(e.target.value))}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      {!isLinkMonster(editForm.card_type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">DEF</label>
                          <input
                            type="number"
                            value={editForm.def ?? ""}
                            onChange={(e) => handleEditChange("def", e.target.value === "" ? undefined : Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attribut</label>
                        <select
                          value={editForm.attribute ?? ""}
                          onChange={(e) => handleEditChange("attribute", e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un attribut</option>
                          {attributes.map((attr) => (
                            <option key={attr.id} value={attr.label}>
                              {attributeToFrench(attr.label)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">ID (lecture seule) : {card.id}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </AdminStructure>
  );
};

export default AdminCardDetail;
