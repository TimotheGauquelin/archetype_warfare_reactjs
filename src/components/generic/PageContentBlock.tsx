import React from "react";

interface PageContentBlockProps {
  children: React.ReactNode;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center space-y-6 tablet:space-y-8 lscreen:space-y-10 py-6 tablet:py-8 lscreen:py-16 max-w-containerSize mx-auto px-3 tablet:px-4 w-full">
      {children}
    </div>
  );
};

export default PageContentBlock;
