import type { Banlist } from "@/types";

type BanlistSessionEntry = {
  etag: string | null;
  banlist: Banlist;
};

const keyFor = (showArchetypeCards: boolean) =>
  `aw:banlist:current:${showArchetypeCards ? "all" : "generic"}`;

export const readBanlistSessionCache = (
  showArchetypeCards: boolean
): Banlist | null => {
  try {
    const raw = sessionStorage.getItem(keyFor(showArchetypeCards));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BanlistSessionEntry | Banlist;
    if (parsed && typeof parsed === "object" && "banlist" in parsed) {
      return (parsed as BanlistSessionEntry).banlist ?? null;
    }
    return parsed as Banlist;
  } catch {
    return null;
  }
};

export const readBanlistSessionEtag = (
  showArchetypeCards: boolean
): string | null => {
  try {
    const raw = sessionStorage.getItem(keyFor(showArchetypeCards));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BanlistSessionEntry | Banlist;
    if (parsed && typeof parsed === "object" && "etag" in parsed) {
      return (parsed as BanlistSessionEntry).etag ?? null;
    }
    return null;
  } catch {
    return null;
  }
};

export const writeBanlistSessionCache = (
  showArchetypeCards: boolean,
  banlist: Banlist | null,
  etag: string | null = null
): void => {
  try {
    const key = keyFor(showArchetypeCards);
    if (!banlist) {
      sessionStorage.removeItem(key);
      return;
    }
    const entry: BanlistSessionEntry = { etag, banlist };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore
  }
};
