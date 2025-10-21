import React from "react";

const Jumbotron = ({ itemMainTitle, itemSubTitle, itemImg }) => {
  return (
    <div
      className="p-5 bg-cover sscreen:bg-contain bg-no-repeat	bg-center sscreen:bg-right-bottom h-[430px] tablet:h-[520px]"
      style={{
        backgroundImage: `url(${
          itemImg ? itemImg : process.env.PUBLIC_URL + "/assets/yugi.png"
        })`,
      }}
    >
      <div className="flex flex-row h-full max-w-containerSize m-auto">
        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-1/2">
          <h2 className="whiteVeilText font-bold text-5xl tablet:text-7xl mb-5">
            {itemMainTitle}
          </h2>
          <p className="whiteVeilText font-bold text-lg tablet:text-2xl mb-5">
            {itemSubTitle}
          </p>
        </div>
        <div className="hidden md:flex flex-col h-full md:w-1/2"></div>
      </div>
    </div>
  );
};

export default Jumbotron;
