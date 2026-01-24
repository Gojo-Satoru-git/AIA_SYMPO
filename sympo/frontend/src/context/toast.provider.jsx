import { useState } from 'react';
import { ToastContext } from './toast.context';

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>;
};

export default ToastProvider;
