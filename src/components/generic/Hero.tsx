import React from "react";

interface HeroProps {
  mainTitle: string;
  subTitle: string;
}

const Hero: React.FC<HeroProps> = ({ mainTitle, subTitle }) => {
  return (
    <div className="relative p-3 lscreen:max-w-containerSize m-auto flex flex-col justify-center text-center h-[520px]">
      <div className="w-1/2 mx-auto">
        <p className="font-bold text-2xl mb-3">{mainTitle}</p>
        <p className="font-medium text-xl">{subTitle}</p>
      </div>
    </div>
  );
};

export default Hero;
