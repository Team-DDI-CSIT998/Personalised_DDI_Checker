// CustomModal.tsx
import React from "react";
import "./CustomModal.css";

interface CustomModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        {message && <p>{message}</p>}
        <div className="modal-actions">
          {onConfirm && (
            <button className="btn-confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
          {cancelText && onCancel && (
            <button className="btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
