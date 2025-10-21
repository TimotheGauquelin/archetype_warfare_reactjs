import { createContext, useContext, useState, useCallback } from "react";

const PopUpContext = createContext();

export const usePopup = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopUpProvider");
  }
  return context;
};

export const PopUpProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Confirmer",
    cancelText: "Annuler",
    onConfirm: null,
    showCancel: true,
    autoClose: false,
    autoCloseDelay: 3000
  });

  const showPopup = useCallback((options) => {
    setPopup({
      isOpen: true,
      type: "info",
      title: "",
      message: "",
      confirmText: "Confirmer",
      cancelText: "Annuler",
      onConfirm: null,
      showCancel: true,
      autoClose: false,
      autoCloseDelay: 3000,
      ...options
    });
  }, []);

  const hidePopup = useCallback(() => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Méthodes de convenance pour différents types de popups
  const showSuccess = useCallback((message, title = "Succès", options = {}) => {
    showPopup({
      type: "success",
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      autoClose: true,
      ...options
    });
  }, [showPopup]);

  const showError = useCallback((message, title = "Erreur", options = {}) => {
    showPopup({
      type: "error",
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      autoClose: true,
      ...options
    });
  }, [showPopup]);

  const showWarning = useCallback((message, title = "Attention", options = {}) => {
    showPopup({
      type: "warning",
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      autoClose: true,
      ...options
    });
  }, [showPopup]);

  const showInfo = useCallback((message, title = "Information", options = {}) => {
    showPopup({
      type: "info",
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      autoClose: true,
      ...options
    });
  }, [showPopup]);

  const showConfirm = useCallback((message, title = "Confirmation", onConfirm, options = {}) => {
    showPopup({
      type: "warning",
      title,
      message,
      confirmText: "Confirmer",
      cancelText: "Annuler",
      onConfirm,
      showCancel: true,
      autoClose: false,
      ...options
    });
  }, [showPopup]);

  const showDeleteConfirm = useCallback((itemName, onConfirm, options = {}) => {
    showPopup({
      type: "error",
      title: "Supprimer",
      message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      cancelText: "Annuler",
      onConfirm,
      showCancel: true,
      autoClose: false,
      ...options
    });
  }, [showPopup]);

  const value = {
    popup,
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showDeleteConfirm
  };

  return (
    <PopUpContext.Provider value={value}>
      {children}
    </PopUpContext.Provider>
  );
};
