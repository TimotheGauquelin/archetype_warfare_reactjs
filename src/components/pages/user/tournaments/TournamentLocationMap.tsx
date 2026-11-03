import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface TournamentLocationMapProps {
  location: string;
  className?: string;
}

const TournamentLocationMap: React.FC<TournamentLocationMapProps> = ({
  location,
  className = "",
}) => {
  const { t } = useTranslation();
  const query = location.trim();

  const embedSrc = useMemo(() => {
    if (!query) return null;
    const params = new URLSearchParams({
      q: query,
      z: "15",
      output: "embed",
    });
    return `https://maps.google.com/maps?${params.toString()}`;
  }, [query]);

  if (!embedSrc) return null;

  return (
    <div className={`space-y-2 h-full ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800">
        {t("tournamentDetail.mapTitle")}
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-slate-100 aspect-[4/3] min-h-[140px] max-h-52">
        <iframe
          title={t("tournamentDetail.mapIframeTitle", { location: query })}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TournamentLocationMap;
