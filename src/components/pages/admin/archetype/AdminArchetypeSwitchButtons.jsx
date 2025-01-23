import React from "react";

const AdminArchetypeSwitchButtons = ({
  setAlertDisplay,
  setDisplayInformation,
  location,
  actionBanlist,
}) => {
  return (
    <div className="grid grid-cols-12">
      <button
        className="bg-green-200 hover:bg-green-300 font-bold col-span-6 py-4 px-2 mr-1 cursor-pointer rounded"
        onClick={() => {
          setDisplayInformation("mainInfo");
        }}
      >
        Informations Principales
      </button>
      <button
        className={`${
          location?.state?.request !== "put"
            ? "bg-gray-100 text-gray-300"
            : "bg-orange-200 hover:bg-orange-300"
        } font-bold col-span-6 py-4 px-2 ml-1 cursor-pointer rounded`}
        disabled={location?.state?.request !== "put" ? true : false}
        onClick={() => {
          setDisplayInformation("banlist");
        }}
      >
        {" "}
        Banlist
      </button>
    </div>
  );
};

export default AdminArchetypeSwitchButtons;
