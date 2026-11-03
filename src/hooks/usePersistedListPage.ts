import { useCallback, useState } from "react";
import { adminListPageStorageKey } from "../constant/adminPaginationScopes";

const readStoredPage = (storageKey: string, fallback: number): number => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw == null) return fallback;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Persiste le numéro de page d'une liste admin dans sessionStorage.
 * La clé est nettoyée quand on quitte la section (voir clearInactiveAdminListPages).
 */
const usePersistedListPage = (
  scopeKey: string,
  defaultPage = 1
): [number, (page: number | ((prev: number) => number)) => void] => {
  const storageKey = adminListPageStorageKey(scopeKey);

  const [page, setPageState] = useState(() =>
    readStoredPage(storageKey, defaultPage)
  );

  const setPage = useCallback(
    (next: number | ((prev: number) => number)) => {
      setPageState((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        const clamped = Math.max(1, Math.floor(value) || 1);
        try {
          sessionStorage.setItem(storageKey, String(clamped));
        } catch {
          /* ignore quota / private mode */
        }
        return clamped;
      });
    },
    [storageKey]
  );

  return [page, setPage];
};

export default usePersistedListPage;
