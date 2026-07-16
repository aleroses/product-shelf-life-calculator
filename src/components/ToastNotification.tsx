import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './ToastNotification.css';

export const ToastNotification = () => {
  const { state, dispatch } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const ToastItem = ({ message, type, onClose }: ToastItemProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" size={18} />;
      case 'error':
        return <XCircle className="toast-icon error" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" size={18} />;
      case 'info':
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`toast-item ${type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button onClick={onClose} className="toast-close-btn" aria-label="Cerrar">
        <X size={14} />
      </button>
    </div>
  );
};
