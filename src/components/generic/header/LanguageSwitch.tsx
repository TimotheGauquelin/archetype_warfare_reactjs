import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLocale, type CardLocale } from "../../../redux/slice/localeSlice";
import type { RootState } from "../../../types";
import i18n from "../../../i18n";

const LanguageSwitch = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  const options: CardLocale[] = ["fr", "en"];

  const selectLocale = (option: CardLocale) => {
    dispatch(setLocale(option));
    void i18n.changeLanguage(option);
  };

  return (
    <div
      className="flex items-center rounded-md border border-gray-200 bg-white overflow-hidden text-sm font-semibold"
      role="group"
      aria-label={t("language.switchLabel")}
    >
      {options.map((option) => {
        const isActive = locale === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => selectLocale(option)}
            className={`px-2.5 py-1.5 uppercase transition-colors ${
              isActive
                ? "bg-red-400 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-pressed={isActive}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
