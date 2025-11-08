import React from "react";
import SubtitleDivider from "../generic/SubtitleDivider";

const CardsSkeleton = ({ itemCount = 6 }) => {
    return (
        <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 border border-gray-200 rounded-lg">
            {[...Array(itemCount)].map((_, index) => (
                <div
                    key={index}
                    className="relative lscreen:col-span-2 sscreen:col-span-3 col-span-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="aspect-[63/88] bg-gray-200 animate-pulse shadow-md rounded"></div>
                </div>
            ))}
        </div>
    );
};

export default CardsSkeleton;
