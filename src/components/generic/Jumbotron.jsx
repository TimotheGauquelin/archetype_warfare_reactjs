import React, { useEffect, useState } from "react";

const Jumbotron = ({ mainTitle, subTitle }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col justify-center text-center h-[520px]">
      <p
        className={`font-bold text-5xl mb-3 transition-all duration-700 ease-out ${
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
  );
};

export default Jumbotron;