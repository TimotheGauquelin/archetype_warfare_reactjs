import React from "react";
import { MdCancel } from "react-icons/md";

const PopUp = ({ alertDisplay, yesButtonAction, noButtonAction }) => {
  return (
    <div
      className={`${
        alertDisplay
          ? "absolute w-full h-full top-0 left-0 !m-0 flex justify-center items-center backdrop-blur-sm"
          : "hidden"
      }`}
    >
      <div className="bg-white p-2 w-1/2 rounded shadow-xl">
        <div
          className=" cursor-pointer flex justify-between items-center"
          onClick={() => {
            noButtonAction();
          }}
        >
          <p className="font-bold">Pop-Up :</p>
          <MdCancel className="text-3xl text-red-600" />
        </div>
        <div className="">
          <div>
            Attention ! Si vous ne sauvegardez pas les données, elles seront
            détruite ! <b> Voulez-vous continuer ?</b>
          </div>
          <div className="mt-2 flex justify-around">
            <button
              className="bg-green-500 w-1/4 p-1 rounded text-white font-bold"
              onClick={() => yesButtonAction()}
            >
              Oui
            </button>
            <button
              className="bg-red-500 w-1/4 p-1 rounded text-white font-bold"
              onClick={() => noButtonAction()}
            >
              Non
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
