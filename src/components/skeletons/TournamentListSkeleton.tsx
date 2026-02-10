const TournamentListSkeleton: React.FC = ( { itemCount = 6 }: { itemCount?: number } ) => {
    return (
        <div className="flex flex-col space-y-2">
            {[...Array(itemCount)].map((_, index) => (
               <div key={index} className="h-[100px] bg-gray-200 animate-pulse shadow-md rounded"></div>
            ))}
        </div>
    );
};

export default TournamentListSkeleton;