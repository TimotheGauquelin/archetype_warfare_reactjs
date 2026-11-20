import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../types";

/**
 * Signale l'expiration de session via expiresAt (serveur),
 * sans dépendre d'un JWT lisible en JS (cookie httpOnly).
 */
export const useAuthAutoLogout = (): boolean => {
  const expiresAt = useSelector((state: RootState) => state.user.expiresAt);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsExpired(false);
      return;
    }

    if (!expiresAt) {
      setIsExpired(false);
      return;
    }

    let timeoutId: number | undefined;
    const expiresAtMs = expiresAt * 1000;
    const now = Date.now();

    if (expiresAtMs <= now) {
      setIsExpired(true);
      return;
    }

    timeoutId = window.setTimeout(() => {
      setIsExpired(true);
    }, expiresAtMs - now);

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [expiresAt, isAuthenticated]);

  return isExpired;
};
