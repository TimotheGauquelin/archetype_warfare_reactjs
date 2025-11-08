import React from "react";
import { Link } from "react-router-dom";

const Slide = ({ archetype, imageVisible = true, showText = true }) => {
  const isWelcomeSlide = archetype?.isWelcome || !archetype?.id;

  return (
    <div
      className="w-full p-5 bg-cover sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom h-[430px] tablet:h-[520px] relative"
      style={{
        backgroundImage: `url(${archetype.slider_img_url})`,
        transition: "opacity 0.5s ease-in-out",
        opacity: imageVisible ? 1 : 0,
      }}
    >
      <div className="flex flex-row h-full max-w-containerSize m-auto">
        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full md:w-1/2">
          <h2 
            className={`whiteVeilText font-bold text-5xl tablet:text-7xl mb-5 transition-all duration-700 ease-out ${
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
            className={`whiteVeilText font-bold text-lg tablet:text-2xl mb-5 transition-all duration-700 ease-out ${
              showText 
                ? "translate-x-0 opacity-100" 
                : "-translate-x-full opacity-0"
            }
            ${archetype?.isWelcome && "animate-pulse text-gray-500"}`}
            style={{
              transitionDelay: showText ? "0.2s" : "0s",
            }}
          >
            {archetype?.slider_info}
          </p>
          {!isWelcomeSlide && archetype?.id && (
            <Link
              className={`group sliderButton inline-flex items-center gap-1 px-6 py-3 rounded-md font-semibold text-white transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 ${
                showText 
                  ? "translate-x-0 opacity-100" 
                  : "-translate-x-full opacity-0"
              }`}
              style={{ 
                animation: showText ? "awGlow 2.4s ease-in-out infinite" : "none",
                transitionDelay: showText ? "0.3s" : "0s",
              }}
              to={`/archetype/${archetype.id}`}
            >
              <span className="relative z-10">Découvrir</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                ➜
              </span>
            </Link>
          )}
        </div>
        <div className="hidden md:flex flex-col h-full w-1/2"></div>
      </div>
    </div>
  );
};

export default Slide;