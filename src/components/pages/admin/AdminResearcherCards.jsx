import React from 'react';

const AdminResearcherCards = ({
  researchedCards,
  researchedCurrentPage,
  setResearchedCardsLabel,
  previewCards,
  setPreviewCards,
  increasePage,
  decreasePage,
}) => {
  return (
    <div className="bg-gray-400 col-span-3 ml-1 p-3 rounded">
      <input
        className="w-full p-1"
        type="text"
        placeholder="Quelle carte recherchez-vous ?"
        onChange={(e) => setResearchedCardsLabel(e.target.value)}
      />
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
        style={{ height: "400px" }}
      >
        {researchedCards?.slice(0, 20).map((card, index) => {
          return (
            <img
              key={index}
              className="col-span-6 p-1 hover:saturate-150 cursor-pointer"
              src={`${card?.card_images[0]?.image_url}`}
              alt=""
              onClick={() => {
                // addCardInsidePreview(card);
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-around items-center">
        <FaAngleLeft className="h-8" onClick={() => decreasePage()} />
        <p>{researchedCurrentPage / 20 + 1}</p>
        <FaAngleRight
          className="h-8"
          onClick={() => {
            increasePage();
          }}
        />
      </div>
    </div>
  );
};

export default AdminResearcherCards; 