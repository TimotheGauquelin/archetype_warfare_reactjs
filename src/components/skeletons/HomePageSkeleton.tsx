import React from "react";

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="w-full m-auto mb-5">
      <div className="w-full m-auto mb-5">
        <div className="flex items-center mb-4">
          <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>
        <div className="grid pb-5 grid-cols-12 gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="col-span-6 sscreen:col-span-4 lscreen:col-span-3 bg-white p-3 rounded-lg aspect-square cardShadow"
            >
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="pt-3 text-center">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full m-auto mb-5">
        <div className="flex items-center mb-4">
          <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>
        <div className="grid pb-5 grid-cols-12 gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="col-span-6 sscreen:col-span-4 lscreen:col-span-3 bg-white p-3 rounded-lg aspect-square cardShadow"
            >
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="pt-3 text-center">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;
