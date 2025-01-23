import React from "react";

const Jumbotron = ({ mainTitle, subTitle }) => {
  return (
    <div className="flex flex-col justify-center text-center h-[520px]">
      <p className="font-bold text-5xl mb-3">{mainTitle}</p>
      <p className="font-medium text-xl">{subTitle}</p>
    </div>
  );
};

export default Jumbotron;
