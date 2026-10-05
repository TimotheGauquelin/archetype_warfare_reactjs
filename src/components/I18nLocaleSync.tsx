import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "../i18n";
import type { RootState } from "../types";

/**
 * Aligne la langue i18n (UI) sur le locale Redux (cartes + UI).
 */
const I18nLocaleSync = () => {
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  return null;
};

export default I18nLocaleSync;
