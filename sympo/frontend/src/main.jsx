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
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <PurchaseProvider>
              <App />
            </PurchaseProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
