import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { adminListFiltersStorageKey } from "../constant/adminPaginationScopes";

const readStoredFilters = <T,>(storageKey: string, fallback: T): T => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed && typeof parsed === "object"
      ? { ...fallback, ...parsed }
      : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Persiste les filtres d'une liste admin dans sessionStorage.
 * Nettoyés hors section via clearInactiveAdminListPages.
 */
const usePersistedListFilters = <T extends object>(
  scopeKey: string,
  defaultFilters: T
): [T, Dispatch<SetStateAction<T>>] => {
  const storageKey = adminListFiltersStorageKey(scopeKey);

  const [filters, setFiltersState] = useState<T>(() =>
    readStoredFilters(storageKey, defaultFilters)
  );

  const setFilters = useCallback(
    (next: SetStateAction<T>) => {
      setFiltersState((prev) => {
        const value =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(value));
        } catch {
          /* ignore quota / private mode */
        }
        return value;
      });
    },
    [storageKey]
  );

  return [filters, setFilters];
};

export default usePersistedListFilters;
