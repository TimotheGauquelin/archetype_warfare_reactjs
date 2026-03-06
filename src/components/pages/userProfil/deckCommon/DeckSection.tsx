import React from "react";

interface DeckSectionBadge {
  label: string;
  value: string | number;
  className: string;
}

interface DeckSectionProps {
  title: string;
  badges: DeckSectionBadge[];
  children: React.ReactNode;
}

const DeckSection: React.FC<DeckSectionProps> = ({ title, badges, children }) => {
  return (
    <div className="p-2 bg-gray-200 rounded">
      <div className="flex flex-row justify-between items-center space-y-1 lscreen:space-y-0 ">
        <span className="font-bold">{title}</span>
        <div className="flex flex-row gap-1">
          {badges.map((badge) => (
            <span key={badge.label} className={`${badge.className} h-fit`}>
              <span className="font-bold">
                <span className="inline lscreen:hidden">
                  {badge.label.charAt(0)}:
                </span>
                <span className="hidden lscreen:inline">
                  {badge.label}:
                </span>
              </span>
              <span> {badge.value}</span>
            </span>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

export default DeckSection;

