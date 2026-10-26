import React from "react";
import { optimizeImageUrl } from "../../../utils/image/optimizeImageUrl";
import { useFetchPriorityHigh } from "../../../utils/image/useFetchPriorityHigh";

interface JumbotronProps {
  itemMainTitle: string;
  itemSubTitle: string;
  itemImg?: string;
}

const Jumbotron: React.FC<JumbotronProps> = ({
  itemMainTitle,
  itemSubTitle,
  itemImg,
}) => {
  const src = itemImg
    ? optimizeImageUrl(itemImg, "jumbotron")
    : import.meta.env.BASE_URL + "assets/yugi.webp";
  const fetchPriorityRef = useFetchPriorityHigh(true);

  return (
    <div className="flex h-full p-5 bg-cover sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom">
      <div className="flex flex-row max-w-containerSize m-auto overflow-visible relative w-full">
        <div className="flex flex-row w-full sscreen:w-1/2">
          <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full">
            <h2
              data-testid="jumbotron-main-title"
              className="leading-none whiteVeilText font-bold text-3xl mb-5"
            >
              {itemMainTitle}
            </h2>
            <p
              data-testid="jumbotron-sub-title"
              className="leading-none whiteVeilText font-bold text-xl mb-5"
            >
              {itemSubTitle}
            </p>
          </div>
        </div>
        <div className="hidden sscreen:block w-1/2">
          <img
            ref={fetchPriorityRef}
            data-testid="jumbotron-img"
            src={src}
            alt="yugi"
            width={800}
            height={520}
            loading="eager"
            decoding="sync"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
