import SubtitleDivider from "./SubtitleDivider";
import CardsSkeleton from "../skeletons/CardsSkeleton";
import NoItemMessage from "./NoItemMessage";
import Card from "./Card";

const CardsSection = ({ title, cards, isFetching, errorMessage , skeletonItemCount = 6}) => (
    <div className="mb-[50px]">
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
                <CardsSkeleton itemCount={6} />
            ) : (
                <NoItemMessage
                    message={`Aucune carte ${title.toLowerCase()} trouvée.`}
                    textPosition="left"
                />
            )
        }
    </div>
);

export default CardsSection;