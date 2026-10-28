import React from "react";

interface HeroProps {
  mainTitle: string;
  subTitle: string;
}

const Hero: React.FC<HeroProps> = ({ mainTitle, subTitle }) => {
  return (
    <div className="relative px-4 py-8 tablet:p-5 lscreen:max-w-containerSize m-auto flex flex-col justify-center text-center min-h-[220px] h-[260px] tablet:h-[380px] sscreen:h-[460px] lscreen:h-[520px]">
      <div className="w-full max-w-xl mx-auto">
        <p className="font-bold text-lg tablet:text-xl sscreen:text-2xl mb-2 sscreen:mb-3 leading-tight">
          {mainTitle}
        </p>
        <p className="font-medium text-sm tablet:text-base sscreen:text-lg leading-snug">
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;
