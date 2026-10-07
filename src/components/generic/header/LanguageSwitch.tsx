import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLocale, type CardLocale } from "../../../redux/slice/localeSlice";
import type { RootState } from "../../../types";
import i18n from "../../../i18n";
import { updateMyLocale } from "../../../services/user";

const LANGUAGE_OPTIONS: Array<{
  value: CardLocale;
  flag: string;
  labelKey: "language.fr" | "language.en";
}> = [
  { value: "fr", flag: "🇫🇷", labelKey: "language.fr" },
  { value: "en", flag: "🇬🇧", labelKey: "language.en" },
];

const LanguageSwitch = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const user = useSelector((state: RootState) => state.user);

  const selectLocale = (option: CardLocale) => {
    if (option === locale) return;

    dispatch(setLocale(option));
    void i18n.changeLanguage(option);

    if (user?.isAuthenticated && user.id && user.token) {
      void updateMyLocale(user.id, option, user.token);
    }
  };

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("language.switchLabel")}</span>
      <span
        className="pointer-events-none absolute left-2.5 text-base leading-none"
        aria-hidden="true"
      >
        {LANGUAGE_OPTIONS.find((option) => option.value === locale)?.flag ?? "🇫🇷"}
      </span>
      <select
        value={locale}
        onChange={(e) => selectLocale(e.target.value as CardLocale)}
        aria-label={t("language.switchLabel")}
        className="appearance-none cursor-pointer rounded-md border border-gray-200 bg-white pl-9 pr-8 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
             {t(option.labelKey)}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2 text-gray-400 text-xs"
        aria-hidden="true"
      >
        ▼
      </span>
    </label>
  );
};

export default LanguageSwitch;
