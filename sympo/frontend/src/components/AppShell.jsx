import useToast from '../context/useToast';
import Toast from './Toast';
import BackgroundEffect from './Bgeffect';

const AppShell = ({ children }) => {
  const { toast } = useToast();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <BackgroundEffect />

      {/* App content */}
      <div className="relative z-10">{children}</div>

      {/* Toast overlay */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
    </div>
  );
};

export default AppShell;
