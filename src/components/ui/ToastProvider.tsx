import { Toaster } from 'sonner';
import './ToastProvider.css';

export const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      className: 'toast-custom',
      duration: 3000,
    }}
    richColors
    closeButton
  />
);
