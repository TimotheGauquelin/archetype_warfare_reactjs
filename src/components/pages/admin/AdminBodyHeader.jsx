import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

const AdminBodyHeader = ({
  label,
  catchphrase,
  buttonUrl,
  returnButton,
  buttonLabel,
  actionButton,
  actionButtonColor,
  actionButtonText,
}) => {
  const history = useNavigate();

  return (
    <div className="flex flex-col sscreen:flex-row justify-between mb-4">
      <div className="mr-6">
        <h1 className="text-4xl font-semibold mb-2">{label}</h1>
        <h2 className="text-gray-600 ml-0.5">{catchphrase}</h2>
      </div>
      {buttonUrl && (
        <Link to={buttonUrl}>
          <button className="block text-white p-2 bg-blue-400 rounded hover:bg-blue-500 cursor-pointer">
            {buttonLabel}
          </button>
        </Link>
      )}
      {returnButton && (
        <div
          className="flex items-center cursor-pointer hover:text-green-400"
          onClick={() => history(-1)}
        >
          <FaAngleLeft />
          <p>Retour</p>
        </div>
      )}
      {actionButton && (
        <button onClick={actionButton} className={`${actionButtonColor}`}>
          {actionButtonText}
        </button>
      )}
    </div>
  );
};

export default AdminBodyHeader;
