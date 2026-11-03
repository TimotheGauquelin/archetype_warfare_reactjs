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
    <div className="flex flex-col sscreen:flex-row sscreen:justify-between sscreen:items-start gap-2 mb-3">
      <div className="sscreen:mr-4 min-w-0">
        <h1 className="text-lg tablet:text-xl font-semibold mb-0.5">{label}</h1>
        {catchphrase && (
          <h2 className="text-gray-600 text-xs tablet:text-sm ml-0.5 leading-snug">
            {catchphrase}
          </h2>
        )}
      </div>
      <div className="flex flex-col items-stretch sscreen:items-end gap-1.5 shrink-0">
        {returnButton && (
          <div
            className="flex items-center gap-0.5 text-sm cursor-pointer hover:text-green-400 self-start sscreen:self-end"
            onClick={() => history(-1)}
          >
            <FaAngleLeft />
            <p>Retour</p>
          </div>
        )}
        {buttonUrl && (
          <Link
            to={buttonUrl}
            className="h-fit block text-center text-white px-2.5 py-1.5 bg-blue-400 rounded hover:bg-blue-500 font-semibold cursor-pointer text-sm"
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
