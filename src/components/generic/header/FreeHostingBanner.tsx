import { useTranslation } from "react-i18next";

const FreeHostingBanner = () => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className="w-full bg-red-100 text-red-800 text-center text-sm sm:text-base px-3 py-2 font-medium"
    >
      {t("banner.freeHosting")}
    </div>
  );
};

export default FreeHostingBanner;
