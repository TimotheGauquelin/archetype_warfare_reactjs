import { useState, useCallback } from 'react';
import React from 'react';

interface PopupConfig {
  title: string;
  content: React.ReactNode | null;
  showCloseButton: boolean;
  closeOnBackdropClick: boolean;
  className: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  onClose?: (() => void) | null;
  confirmText: string;
  cancelText: string;
}

interface ShowConfirmDialogParams {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ShowAlertParams {
  title?: string;
  message?: string;
  onClose?: () => void;
  buttonText?: string;
}

const usePopup = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    title: '',
    content: null,
    showCloseButton: true,
    closeOnBackdropClick: true,
    className: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler'
  });

  const openPopup = useCallback((config: Partial<PopupConfig> = {}) => {
    setPopupConfig(prev => ({
      ...prev,
      ...config
    }));
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showConfirmDialog = useCallback(({
    title = 'Confirmation',
    message = 'Êtes-vous sûr de vouloir continuer ?',
    onConfirm,
    onCancel,
    confirmText = 'Confirmer',
    cancelText = 'Annuler'
  }: ShowConfirmDialogParams) => {
    openPopup({
      title,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                closePopup();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                closePopup();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    });
  }, [openPopup, closePopup]);

  const showAlert = useCallback(({
    title = 'Information',
    message = '',
    onClose,
    buttonText = 'OK'
  }: ShowAlertParams) => {
    openPopup({
      title,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (onClose) onClose();
                closePopup();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              {buttonText}
            </button>
          </div>
        </div>
      ),
      onClose
    });
  }, [openPopup, closePopup]);

  return {
    isOpen,
    popupConfig,
    openPopup,
    closePopup,
    showConfirmDialog,
    showAlert
  };
};

export default usePopup;
