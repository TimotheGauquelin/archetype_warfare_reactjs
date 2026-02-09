import React from "react";

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const PopUp: React.FC<PopUpProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "",
  showCloseButton = true,
  closeOnBackdropClick = true,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-1/2 mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Fermer"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopUp;