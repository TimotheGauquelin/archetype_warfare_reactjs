import { DISCORD_URL, TWITCH_URL } from "@/utils/const/extraLink";
import { currentYear } from "@/utils/date/currentYear";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="px-3 py-4 tablet:p-4 bg-gray-200 text-gray-700 border-t border-gray-300">
      <div className="flex flex-col border-b w-full max-w-containerSize mx-auto">
        <p className="text-gray-700 text-xs tablet:text-sm leading-snug pb-3 tablet:pb-4">
          {t("footer.legal")}
        </p>
        <div className="border-t border-gray-300 pt-3 tablet:pt-4 flex flex-col gap-3 sscreen:flex-row sscreen:justify-between sscreen:items-center">
          <p className="text-gray-700 text-xs tablet:text-sm order-2 sscreen:order-1">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <p className="text-gray-700 text-xs tablet:text-sm leading-snug order-3 sscreen:order-2">
            {t("footer.tagline")}
          </p>
          <div className="flex flex-row items-center gap-2 order-1 sscreen:order-3">
            <a
              href={TWITCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-700 p-1.5 rounded-sm cursor-pointer"
              aria-label="Twitch"
            >
              <FaTwitch className="w-4 h-4" color="white" />
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-1.5 rounded-sm cursor-pointer"
              aria-label="Discord"
            >
              <FaDiscord className="w-4 h-4" color="white" />
            </a>
            <div className="bg-red-700 p-1.5 rounded-sm" aria-hidden>
              <FaYoutube className="w-4 h-4" color="white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
