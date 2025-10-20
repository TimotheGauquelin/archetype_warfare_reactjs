import React from "react";
import { Link } from "react-router-dom";

const Slide = ({ archetype }) => {
  return (
    <div
      className="p-5 bg-cover sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom h-[430px] tablet:h-[520px]"
      style={{
        backgroundImage: `url(${
          archetype.slider_img_url
            ? archetype.slider_img_url
            : process.env.PUBLIC_URL + "/assets/yugi.png"
        })`,
      }}
    >
      <div className="flex flex-row h-full max-w-containerSize m-auto">
        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full md:w-1/2">
          <h2 className="whiteVeilText font-bold text-5xl tablet:text-7xl mb-5">
            {archetype.name}
          </h2>
          <p className="whiteVeilText font-bold text-lg tablet:text-2xl mb-5">
            {archetype.slider_info}
          </p>
          <Link
            className="sliderButton"
            to={`/archetype/${archetype.id}`}
          >
            Découvrir
          </Link>
        </div>
        <div className="hidden md:flex flex-col h-full w-1/2"></div>
      </div>
    </div>
  );
};

export default Slide;
