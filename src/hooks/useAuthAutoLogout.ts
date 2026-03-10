import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import type { DecodedToken, RootState } from "../types";

/**
 * Hook qui signale quand le token JWT est expiré.
 *
 * - Lit le token dans le store Redux
 * - Décode le JWT pour récupérer exp
 * - Si déjà expiré -> renvoie immédiatement true
 * - Sinon -> setTimeout jusqu'à l'expiration, puis passe à true
 */
export const useAuthAutoLogout = (): boolean => {
  const token = useSelector((state: RootState) => state.user.token);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsExpired(false);
      return;
    }

    let timeoutId: number | undefined;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.exp) return;

      const expiresAt = decoded.exp * 1000; // exp en secondes
      const now = Date.now();

      if (expiresAt <= now) {
        setIsExpired(true);
        return;
      }

      const delay = expiresAt - now;
      timeoutId = window.setTimeout(() => {
        setIsExpired(true);
      }, delay);
    } catch {
      // Si le token est illisible, on considère la session expirée
      setIsExpired(true);
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [token]);

  return isExpired;
};

