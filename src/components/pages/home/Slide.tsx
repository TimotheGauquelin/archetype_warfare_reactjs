import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Archetype } from "../../../types";
import { getArchetypePublicPath } from "../../../constant/urlsFront";
import { optimizeImageUrl } from "../../../utils/image/optimizeImageUrl";
import { useFetchPriorityHigh } from "../../../utils/image/useFetchPriorityHigh";

interface SlideProps {
  archetype: Archetype;
  imageVisible?: boolean;
  showText?: boolean;
  loadImage?: boolean;
  isActive?: boolean;
}

const Slide: React.FC<SlideProps> = ({
  archetype,
  imageVisible = true,
  showText = true,
  loadImage = true,
  isActive = false,
}) => {
  const { t } = useTranslation();
  const isWelcomeSlide = archetype?.isWelcome || !archetype?.id;
  const fetchPriorityRef = useFetchPriorityHigh(isActive);
  const imageSrc = loadImage
    ? optimizeImageUrl(archetype.slider_img_url, "slider")
    : undefined;

  const imageOpacityClass = imageVisible ? "opacity-100" : "opacity-0";

  return (
    <div className="w-full overflow-visible bg-cover sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom h-[430px] tablet:h-[520px] relative">
      {/* Mobile : image en arrière-plan plein écran */}
      <div
        className={`sscreen:hidden absolute inset-0 pointer-events-none transition-opacity duration-300 ${imageOpacityClass}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            width={800}
            height={520}
            decoding={isActive ? "sync" : "async"}
            loading={isActive ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/45 to-white/10"
          aria-hidden
        />
      </div>

      {/* Desktop : image à droite (comportement d'origine) */}
      <div
        className={`hidden sscreen:block absolute top-0 bottom-0 left-1/2 pointer-events-none transition-opacity duration-300 ${imageOpacityClass}`}
      >
        {imageSrc ? (
          <img
            ref={fetchPriorityRef}
            src={imageSrc}
            alt={archetype.name}
            width={800}
            height={520}
            decoding={isActive ? "sync" : "async"}
            loading={isActive ? "eager" : "lazy"}
            className="w-full h-full object-cover object-left"
          />
        ) : (
          <div
            className="w-[800px] h-[520px] max-w-full bg-transparent"
            aria-hidden
          />
        )}
      </div>

      <div className="relative z-10 flex flex-row h-full max-w-containerSize m-auto overflow-visible px-4 sscreen:px-0">
        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full sscreen:w-1/2 pb-8 sscreen:pb-0">
          <h2
            className={`whiteVeilText leading-none font-bold text-4xl tablet:text-7xl mb-5 transition-all duration-700 ease-out ${
              showText
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
            style={{
              transitionDelay: showText ? "0.1s" : "0s",
            }}
          >
            {archetype?.name || "Bienvenue sur ArchetypeBattle"}
            {archetype?.nameSubtitle && (
              <>
                <br />
                {archetype.nameSubtitle}
              </>
            )}
          </h2>
          <p
            className={`whiteVeilText leading-none font-bold text-lg tablet:text-2xl mb-5 transition-all duration-700 ease-out ${
              showText
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }
            ${archetype?.isWelcome && "text-gray-500"}`}
            style={{
              transitionDelay: showText ? "0.2s" : "0s",
            }}
          >
            {archetype?.slider_info}
          </p>
          {!isWelcomeSlide && getArchetypePublicPath(archetype) && (
            <Link
              className={`group sliderButton inline-flex items-center gap-1 px-6 py-3 rounded-md font-semibold text-white transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 ${
                showText
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
              style={{
                animation: showText
                  ? "awGlow 2.4s ease-in-out infinite"
                  : "none",
                transitionDelay: showText ? "0.3s" : "0s",
              }}
              to={getArchetypePublicPath(archetype)!}
            >
              <span className="relative z-10">{t("home.discover")}</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                ➜
              </span>
            </Link>
          )}
        </div>
        <div className="hidden sscreen:block w-1/2 flex-shrink-0" aria-hidden />
      </div>
    </div>
  );
};

export default Slide;
