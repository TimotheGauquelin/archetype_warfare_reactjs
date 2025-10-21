import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTrashAlt } from "react-icons/fa";

const PopUp = ({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message, 
  confirmText = "Confirmer", 
  cancelText = "Annuler",
  onConfirm,
  showCancel = true,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer le scroll du body
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          buttonColor: "bg-green-500 hover:bg-green-600"
        };
      case "warning":
        return {
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          buttonColor: "bg-yellow-500 hover:bg-yellow-600"
        };
      case "error":
        return {
          icon: <FaTrashAlt className="text-red-500" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          buttonColor: "bg-red-500 hover:bg-red-600"
        };
      case "info":
      default:
        return {
          icon: <FaInfoCircle className="text-blue-500" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-blue-500 hover:bg-blue-600"
        };
    }
  };

  const { icon, bgColor, borderColor, buttonColor } = getIconAndColors();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md ${bgColor} ${borderColor} border rounded-xl shadow-2xl transform transition-all duration-300 ease-out ${
          mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-white ${buttonColor} rounded-lg font-medium transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;