import React from "react";

interface PageContentBlockProps {
  children: React.ReactNode;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center space-y-4 lscreen:space-y-6 py-8 lscreen:py-16 max-w-containerSize mx-auto">
      {children}
    </div>
  );
};

export default PageContentBlock;
