import React from "react";
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
  const src =
    itemImg?.trim() ||
    import.meta.env.BASE_URL + "assets/yugi.webp";
  const fetchPriorityRef = useFetchPriorityHigh(true);

  return (
    <div className="relative flex min-h-[260px] h-[300px] tablet:h-[400px] sscreen:h-[520px] overflow-visible">
      {/* Desktop uniquement : pas de slider_img en portable */}
      <div className="hidden sscreen:block absolute inset-0 pointer-events-none overflow-visible">
        <div className="relative h-full w-full max-w-containerSize mx-auto">
          <div className="absolute inset-y-0 left-1/2 w-1/2 overflow-visible">
            <img
              ref={fetchPriorityRef}
              data-testid="jumbotron-img"
              src={src}
              alt=""
              width={800}
              height={520}
              loading="eager"
              decoding="sync"
              className="absolute inset-y-0 left-0 h-full w-auto max-w-none object-contain object-left-bottom"
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-row max-w-containerSize m-auto overflow-visible w-full h-full px-3 pt-3 tablet:px-5 tablet:pt-5 pb-0">
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
        <div className="hidden sscreen:block w-1/2" aria-hidden />
      </div>
    </div>
  );
};

export default Jumbotron;
