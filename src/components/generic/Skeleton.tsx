// Skeleton.js
import React from 'react';

interface SkeletonProps {
  type: 'text' | 'image' | 'card';
}

const Skeleton: React.FC<SkeletonProps> = ({ type }) => {
  switch (type) {
    case 'text':
      return <div className="w-full h-4 bg-gray-300 animate-pulse rounded"></div>;
    case 'image':
      return <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-full"></div>;
    case 'card':
      return (
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg">
          <div className="h-1/3 bg-gray-400 animate-pulse rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-400 animate-pulse w-3/4 mb-2 rounded"></div>
            <div className="h-4 bg-gray-400 animate-pulse w-1/2 rounded"></div>
          </div>
        </div>
      );
    default:
      return <div />;
  }
};

export default Skeleton;
