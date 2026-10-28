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
    <div className="relative flex min-h-[260px] h-[300px] tablet:h-[400px] sscreen:h-[520px] p-3 tablet:p-5 overflow-hidden bg-cover sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom">
      <img
        src={src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-[center_20%] opacity-35 sscreen:hidden pointer-events-none"
        width={800}
        height={520}
        loading="eager"
        decoding="sync"
      />
      <div className="relative z-[1] flex flex-row max-w-containerSize m-auto overflow-visible w-full h-full">
        <div className="flex flex-row w-full sscreen:w-1/2">
          <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full pb-1 tablet:pb-0">
            <h2
              data-testid="jumbotron-main-title"
              className="leading-tight whiteVeilText font-bold text-xl tablet:text-2xl sscreen:text-3xl mb-2 tablet:mb-3 sscreen:mb-5 max-w-full break-words"
            >
              {itemMainTitle}
            </h2>
            <p
              data-testid="jumbotron-sub-title"
              className="leading-snug whiteVeilText font-bold text-base tablet:text-lg sscreen:text-xl mb-2 tablet:mb-3 sscreen:mb-5 max-w-full break-words"
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
            alt=""
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
