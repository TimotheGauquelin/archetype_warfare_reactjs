import React, { useEffect, useState } from "react";

interface HeroProps {
  mainTitle: string;
  subTitle: string;
}

const Hero: React.FC<HeroProps> = ({ mainTitle, subTitle }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative p-3 lscreen:max-w-containerSize m-auto flex flex-col justify-center text-center h-[520px]">
      <div className="w-1/2 mx-auto">
      <p
        className={`font-bold text-2xl mb-3 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "500ms" }}
      >
        {mainTitle}
      </p>
      <p
        className={`font-medium text-xl transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        {subTitle}
      </p>
      </div>
    </div>
  );
};

export default Hero;