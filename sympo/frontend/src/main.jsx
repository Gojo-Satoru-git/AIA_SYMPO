import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './App.css';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './context/toast.provider';
import 'react-toastify/dist/ReactToastify.css';
import CartProvider from './context/cart.provider';
import { PurchaseProvider } from './context/PurchaseContext';
import { SeatAvalProvider } from './context/SeatAvalProvider.jsx';
import WorkshoProvider from './context/WorkshopProvider.jsx';
import Eventprovider from './context/Eventprovider.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <Eventprovider>
            <WorkshoProvider>
              <CartProvider>
                <PurchaseProvider>
                  <SeatAvalProvider>
                    <App />
                  </SeatAvalProvider>
                </PurchaseProvider>
              </CartProvider>
            </WorkshoProvider>
          </Eventprovider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
