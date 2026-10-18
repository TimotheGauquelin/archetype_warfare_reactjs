import { useTranslation } from "react-i18next";
import { getCountryFlagUrl, getCountryName } from "@/utils/country";

interface CountryFlagLabelProps {
  countryCode: string | null | undefined;
  className?: string;
}

/** Affiche drapeau + (Nom du pays), ou rien si pas de pays. */
const CountryFlagLabel = ({ countryCode, className = "" }: CountryFlagLabelProps) => {
  const { i18n } = useTranslation();
  if (!countryCode) return null;

  const name = getCountryName(countryCode, i18n.language ?? "fr");
  if (!name) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <img
        src={getCountryFlagUrl(countryCode)}
        alt=""
        className="w-5 h-3.5 object-cover rounded-sm shrink-0"
        width={20}
        height={14}
      />
      <span className="text-gray-600">({name})</span>
    </span>
  );
};

export default CountryFlagLabel;
