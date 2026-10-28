import React from "react";
import Header from "../generic/header/Header";
import SubtitleDivider from "../generic/SubtitleDivider";
import PageContentBlock from "../generic/PageContentBlock";

const SkeletonArchetypePage: React.FC = () => {
    return (
        <div>
            <div id="headBlock" className="imageBackground">
                <Header />

                <div className="p-3 tablet:p-5 min-h-[260px] h-[300px] tablet:h-[400px] sscreen:h-[520px]">
                    <div className="flex flex-row h-full max-w-containerSize m-auto">
                        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-full sscreen:w-1/2">
                            <div className="h-7 tablet:h-10 sscreen:h-12 bg-gray-300 rounded w-40 tablet:w-56 sscreen:w-64 mb-3 tablet:mb-5 animate-pulse"></div>
                            <div className="h-4 tablet:h-5 sscreen:h-6 bg-gray-300 rounded w-56 tablet:w-72 sscreen:w-80 mb-3 tablet:mb-5 animate-pulse"></div>
                        </div>
                        <div className="hidden sscreen:flex flex-col h-full w-1/2"></div>
                    </div>
                </div>

                <div className="relative px-3 pb-3 sscreen:p-0 lscreen:max-w-containerSize m-auto">
                    <div
                        className="bg-white flex flex-col lscreen:flex-row w-full mx-auto shadow-lg rounded-xl lscreen:absolute lscreen:bottom-[-64px] p-3 tablet:p-5 lscreen:max-w-containerSize m-auto gap-5 lscreen:gap-0"
                    >
                        <div className="flex flex-col lscreen:w-1/3 lscreen:mx-3">
                            <div className="h-5 tablet:h-6 bg-gray-300 rounded w-40 mb-3 animate-pulse"></div>
                            <div className="h-full lscreen:w-80 mt-2 lscreen:mt-5 grid grid-cols-4 tablet:grid-cols-10 gap-2 tablet:gap-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="col-span-1 tablet:col-span-2 text-center">
                                        <div className="aspect-square max-w-[64px] mx-auto bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-3 tablet:h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col lscreen:w-1/3 lscreen:mx-3">
                            <div className="h-5 tablet:h-6 bg-gray-300 rounded w-44 mb-3 animate-pulse"></div>
                            <div className="h-full lscreen:w-80 mt-2 lscreen:mt-5 grid grid-cols-4 tablet:grid-cols-10 gap-2 tablet:gap-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="col-span-1 tablet:col-span-2 text-center">
                                        <div className="aspect-square max-w-[64px] mx-auto bg-gray-200 rounded-full animate-pulse mb-2"></div>
                                        <div className="h-3 tablet:h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col lscreen:w-1/3 lscreen:mx-3">
                            <div className="h-5 tablet:h-6 bg-gray-300 rounded w-32 mb-3 animate-pulse"></div>
                            <div className="h-full lscreen:w-80 mt-2 lscreen:mt-5 grid grid-cols-4 tablet:grid-cols-10 gap-2 tablet:gap-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="col-span-1 tablet:col-span-2 text-center">
                                        <div className="aspect-square max-w-[64px] mx-auto bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-3 tablet:h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main>
              <PageContentBlock>
                  <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">

                      <div className="pt-2 tablet:pt-5">
                          <SubtitleDivider
                              label="Toutes les cartes de l'archétype"
                              displayDivider
                          />
                      </div>

                      <div className="bg-gray-100 p-2.5 tablet:p-4 grid grid-cols-12 gap-2 tablet:gap-3 sscreen:gap-4 mb-4 border border-gray-200 rounded-lg">
                          {[...Array(12)].map((_, index) => (
                              <div
                                  key={index}
                                  className="relative lscreen:col-span-2 sscreen:col-span-3 col-span-6"
                                  style={{ animationDelay: `${index * 50}ms` }}
                              >
                                  <div className="aspect-[63/88] bg-gray-200 animate-pulse shadow-md"></div>
                              </div>
                          ))}
                      </div>
                  </div>
              </PageContentBlock>
            </main>
        </div>
    );
};

export default SkeletonArchetypePage;
