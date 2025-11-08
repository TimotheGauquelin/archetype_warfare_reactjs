import React from "react";
import Header from "../generic/header/Header";
import SubtitleDivider from "../generic/SubtitleDivider";
import PageContentBlock from "../generic/PageContentBlock";

const SkeletonArchetypePage = () => {
    return (
        <div>
            <div id="headBlock" className="imageBackground">
                <Header />

                <div className="p-5 h-[430px] tablet:h-[520px]">
                    <div className="flex flex-row h-full max-w-containerSize m-auto">
                        <div className="flex flex-col items-start justify-end sscreen:justify-center h-full w-1/2">
                            <div className="h-12 bg-gray-300 rounded w-64 mb-5 animate-pulse"></div>
                            <div className="h-6 bg-gray-300 rounded w-80 mb-5 animate-pulse"></div>
                        </div>
                        <div className="hidden md:flex flex-col h-full md:w-1/2"></div>
                    </div>
                </div>

                <div className="relative px-3 pb-3 sscreen:p-0 lscreen:max-w-containerSize m-auto">
                    <div
                        className="bg-white flex flex-col lscreen:flex-row w-full mx-auto shadow-lg rounded-xl lscreen:absolute p-5 lscreen:max-w-containerSize m-auto"
                        style={{
                            bottom: "-64px",
                        }}
                    >
                        <div className="flex flex-col lscreen:w-1/3 mx-3 mb-5 lscreen:mb-0">
                            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
                            <div className="h-full lscreen:w-80 lscreen:mt-5 grid grid-cols-10 lscreen:grid-cols-10 gap-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="col-span-2 text-center">
                                        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skeleton Attributes Section */}
                        <div className="flex flex-col lscreen:w-1/3 mx-3 mb-5 lscreen:mb-0">
                            <div className="h-6 bg-gray-300 rounded w-44 mb-4 animate-pulse"></div>
                            <div className="h-full lscreen:w-80 lscreen:mt-5 grid grid-cols-10 lscreen:grid-cols-10 gap-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="col-span-2 text-center">
                                        <div className="aspect-square bg-gray-200 rounded-full animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col lscreen:w-1/3 mx-3">
                            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                            <div className="h-full flex flex-col justify-between gap-4">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                        <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PageContentBlock>
                <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">

                    <div className="py-5">
                        <SubtitleDivider
                            label="Toutes les cartes de l'archétype"
                            displayDivider
                        />
                    </div>

                    <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 mb-4 border border-gray-200 rounded-lg">
                        {[...Array(12)].map((_, index) => (
                            <div
                                key={index}
                                className="relative lscreen:col-span-2 sscreen:col-span-3 col-span-4"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="aspect-[63/88] bg-gray-200 animate-pulse shadow-md"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageContentBlock>
        </div>
    );
};

export default SkeletonArchetypePage;
