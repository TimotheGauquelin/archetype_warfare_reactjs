import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        type="button"
        className="w-full flex flex-row justify-between items-center px-4 py-3 text-left hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-lg text-gray-600 shrink-0">
          {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
        </span>
      </button>
      <div className={`px-4 pb-4 space-y-3 ${isCollapsed ? "hidden" : ""}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
