import React from "react";

interface JumbotronProps {
  itemMainTitle: string;
  itemSubTitle: string;
  itemImg?: string;
}

const Jumbotron: React.FC<JumbotronProps> = ({ itemMainTitle, itemSubTitle, itemImg }) => {
  return (
    <div
      className="flex h-full p-5 bg-cover sscreen:bg-contain bg-no-repeat	bg-center sscreen:bg-right-bottom"
    >
      <div className="flex flex-row max-w-containerSize m-auto overflow-visible relative">
        <div className="flex flex-row w-1/2">
          <div className="flex flex-col items-start justify-end sscreen:justify-center h-full">
            <h2 data-testid="jumbotron-main-title" className="leading-none whiteVeilText font-bold text-3xl mb-5">
              {itemMainTitle}
            </h2>
            <p data-testid="jumbotron-sub-title" className="leading-none whiteVeilText font-bold text-1xl tablet:text-2xl mb-5">
              {itemSubTitle}
            </p>
          </div>
          <div className="hidden md:flex flex-col h-full md:w-1/2"></div>
        </div>
        <div className="w-1/2">
          <img data-testid="jumbotron-img" src={itemImg ? itemImg : import.meta.env.BASE_URL + "assets/yugi.png"} alt="yugi" className="w-full h-full object-cover" />
        </div>
      </div>
    </div >
  );
};

export default Jumbotron;
