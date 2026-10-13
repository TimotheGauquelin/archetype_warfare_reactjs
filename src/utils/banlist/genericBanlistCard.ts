import {
  STATUS_FORBIDDEN,
  STATUS_LIMITED,
  STATUS_SEMI_LIMITED,
  STATUS_UNLIMITED,
} from "../const/banlistConst";
import type { BanlistCard } from "../../types";

export const RESTRICTED_BANLIST_STATUSES = [
  STATUS_FORBIDDEN,
  STATUS_LIMITED,
  STATUS_SEMI_LIMITED,
] as const;

export const isRestrictedBanlistStatus = (label?: string | null): boolean => {
  if (!label) return false;
  const normalized = label.toLowerCase();
  return RESTRICTED_BANLIST_STATUSES.some(
    (status) => status.toLowerCase() === normalized
  );
};

export const isUnlimitedBanlistStatus = (label?: string | null): boolean => {
  if (!label) return false;
  return label.toLowerCase() === STATUS_UNLIMITED.toLowerCase();
};

/**
 * Entrée banlist "générique restreinte" :
 * - ligne BAC avec archetype_id NULL (pas le archetype_id de la carte YGO)
 * - statut Forbidden / Limited / Semi-Limited
 */
export const isGenericRestrictedBanlistCard = (
  banlistCard: BanlistCard | null | undefined
): boolean => {
  if (!banlistCard?.card) return false;

  // Important : utiliser l'archétype de la LIGNE banlist, pas celui de la carte
  const bacArchetypeId = (banlistCard as { archetype_id?: number | null }).archetype_id;
  if (bacArchetypeId != null) return false;

  return isRestrictedBanlistStatus(banlistCard.card_status?.label);
};
