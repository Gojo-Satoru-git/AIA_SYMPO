import { useState, useCallback } from "react";
import { ToastContext } from "./toast.context";
import Toast from "../components/Toast";

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ id: Date.now(), message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
