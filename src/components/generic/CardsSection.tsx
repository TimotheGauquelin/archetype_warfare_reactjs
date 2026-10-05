import { useTranslation } from "react-i18next";
import SubtitleDivider from "./SubtitleDivider";
import CardsSkeleton from "../skeletons/CardsSkeleton";
import NoItemMessage from "./NoItemMessage";
import Card from "./Card";
import type { CardWithBanlistStatus } from "../../types";

interface CardsSectionProps {
  title: string;
  cards: CardWithBanlistStatus[];
  isFetching?: boolean;
  errorMessage?: string;
  skeletonItemCount?: number;
}

const CardsSection: React.FC<CardsSectionProps> = ({ title, cards, isFetching, skeletonItemCount = 6 }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-10">
      <SubtitleDivider
        label={`${title} (${cards.length})`}
        displayDivider
      />
      {cards.length > 0
        ? (
          <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 border border-gray-200 rounded-lg">
            {
              cards.map((card, index) => (
                <Card key={`${card.card.id}-${index}`} card={card} />
              ))
            }
          </div>
        ) : isFetching ? (
          <CardsSkeleton itemCount={skeletonItemCount} />
        ) : (
          <NoItemMessage
            message={t("banlist.noCards", { title: title.toLowerCase() })}
            textPosition="left"
          />
        )
      }
    </div>
  );
};

export default CardsSection;
