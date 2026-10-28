import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

interface AdminBodyHeaderProps {
  label: string;
  catchphrase?: string;
  buttonUrl?: string;
  returnButton?: boolean;
  buttonLabel?: string;
  actionButton?: () => void;
  actionButtonColor?: string;
  actionButtonText?: string;
  actionButtonDisabled?: boolean;
}

const AdminBodyHeader: React.FC<AdminBodyHeaderProps> = ({
  label,
  catchphrase,
  buttonUrl,
  returnButton,
  buttonLabel,
  actionButton,
  actionButtonColor,
  actionButtonText,
  actionButtonDisabled,
}) => {
  const history = useNavigate();

  return (
    <div className="flex flex-col sscreen:flex-row sscreen:justify-between sscreen:items-start gap-3 mb-4">
      <div className="sscreen:mr-6 min-w-0">
        <h1 className="text-xl tablet:text-2xl font-semibold mb-1 tablet:mb-2">{label}</h1>
        {catchphrase && (
          <h2 className="text-gray-600 text-sm tablet:text-base ml-0.5 leading-snug">
            {catchphrase}
          </h2>
        )}
      </div>
      <div className="flex flex-col items-stretch sscreen:items-end gap-2 shrink-0">
        {returnButton && (
          <div
            className="flex items-center cursor-pointer hover:text-green-400 self-start sscreen:self-end"
            onClick={() => history(-1)}
          >
            <FaAngleLeft />
            <p>Retour</p>
          </div>
        )}
        {buttonUrl && (
          <Link
            to={buttonUrl}
            className="h-fit block text-center text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer text-sm tablet:text-base"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
      {actionButton && (
        <button
          type="button"
          onClick={actionButton}
          className={`shrink-0 ${actionButtonColor ?? ""}`}
          disabled={actionButtonDisabled}
        >
          {actionButtonText}
        </button>
      )}
    </div>
  );
};

export default AdminBodyHeader;
