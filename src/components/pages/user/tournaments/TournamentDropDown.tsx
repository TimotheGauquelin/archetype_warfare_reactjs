import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export const TournamentDropDown = ({
  title,
  children,
  defaultCollapsed = false,
  nested = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  /** Fermé par défaut */
  defaultCollapsed?: boolean;
  /** Style plus compact pour une ronde dans Matchmakings */
  nested?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section
      className={
        nested
          ? "border border-gray-200 rounded-lg overflow-hidden mb-3 last:mb-0"
          : "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      }
    >
      <button
        type="button"
        className={`w-full flex flex-row justify-between items-center text-left hover:bg-gray-50 ${
          nested ? "px-3 py-2" : "px-4 py-3"
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        {nested ? (
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        ) : (
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        )}
        <span className="text-lg text-gray-600 shrink-0">
          {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
        </span>
      </button>
      <div
        className={`${nested ? "p-3" : "p-4"} ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
};
