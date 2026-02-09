const MyDecksDivSkeleton = ({ itemCount = 4 }: { itemCount?: number }) => {
    return (
        <div className="grid grid-cols-1 sscreen:grid-cols-2 lscreen:grid-cols-4 gap-4">
            {[...Array(itemCount)].map((_, index) => (
                <div key={index} className="p-4 bg-gray-300 rounded-lg animate-pulse h-20" />
            ))}
        </div>
    );
};

export default MyDecksDivSkeleton;