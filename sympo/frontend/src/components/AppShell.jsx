import useToast from '../context/useToast';
import Toast from './Toast';
import BackgroundEffect from './Bgeffect';

const AppShell = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background */}
      <BackgroundEffect />

      {/* App content */}
      <div className="relative z-10">{children}</div>

      {/* Toast Stack */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {toasts.slice(0, 2).map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AppShell;
