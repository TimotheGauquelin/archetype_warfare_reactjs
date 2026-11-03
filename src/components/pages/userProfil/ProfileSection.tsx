import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  /** Affiche une icône pour replier / déplier le contenu. */
  collapsible?: boolean;
  /** Ouvert par défaut (uniquement si collapsible). */
  defaultOpen?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
  action,
  collapsible = false,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const titleRow = (
    <>
      <h2 className="text-xs font-bold tracking-wide uppercase text-gray-800">
        {title}
      </h2>
      <div className="flex items-center gap-2 shrink-0">
        {action}
        {collapsible && (
          <FaChevronDown
            className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        )}
      </div>
    </>
  );

  return (
    <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {collapsible ? (
        <button
          type="button"
          className="w-full flex items-center justify-between gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-3 text-left transition-colors"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
        >
          {titleRow}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-2 bg-gray-200 px-4 py-3">
          {titleRow}
        </div>
      )}
      {(!collapsible || isOpen) && (
        <div className="p-4 tablet:p-5">{children}</div>
      )}
    </section>
  );
};

export default ProfileSection;
