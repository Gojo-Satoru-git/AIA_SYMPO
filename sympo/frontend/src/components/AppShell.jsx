import useToast from '../context/useToast';
import Toast from './Toast';

const AppShell = ({ children }) => {
  const { toast } = useToast();

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {children}
    </>
  );
};

export default AppShell;
