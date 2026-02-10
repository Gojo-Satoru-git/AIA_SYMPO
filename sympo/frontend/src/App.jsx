import { Routes, Route } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import Home from './screens/Home';
import About from './screens/About';
import Events from './screens/Events';
import FAQs from './screens/Faqs';
import Contact from './screens/Contacts';
import Register from './screens/Register';
import Footer from './components/footer';
import NavMenubar from './components/NavMenuBar';
import Auth from './screens/Auth';
import AppShell from './components/AppShell';
import ResetPassword from './screens/ResetPassword';

import AdminRoute from './components/AdminRoute';
import ScanPage from './screens/ScanPage';
import Scanner from './screens/Scanner';
import MaintenancePage from './screens/Maintenance';
// import TOSHome from './TOS/Home';

const RedirectToTOS = () => {
  useEffect(() => {
    window.location.href = 'https://tos2026.web.app';
  }, []);
  return null;
};

const MainPage = () => {
  const HomeRef = useRef(null);
  const AboutRef = useRef(null);
  const EventsRef = useRef(null);
  const FAQsRef = useRef(null);
  const ContactRef = useRef(null);
  const RegisterRef = useRef(null);

  return (
    <div className="relative z-10 bg-transparent">
      <NavMenubar
        HomeRef={HomeRef}
        AboutRef={AboutRef}
        EventsRef={EventsRef}
        FAQsRef={FAQsRef}
        ContactRef={ContactRef}
        RegisterRef={RegisterRef}
      />

      <div ref={HomeRef}>
        <Home />
      </div>
      <div ref={AboutRef}>
        <About />
      </div>
      <div ref={EventsRef} id="Events">
        <Events />
      </div>
      <div ref={RegisterRef}>
        <Register />
      </div>
      <div ref={FAQsRef}>
        <FAQs />
      </div>
      <div ref={ContactRef}>
        <Contact />
      </div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AppShell>
      <>
        <Routes>
          {/* Scroll-based landing page */}
          <Route path="/maintenance" element={<MainPage />} />
          <Route path="/" element={<MaintenancePage />} />
          {/* Auth pages */}
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />

          <Route path="/tos" element={<RedirectToTOS />} />

          {/* Reset Password Route */}
          <Route path="/auth-action" element={<ResetPassword />} />
          {/* QR Routes */}
          <Route
            path="/qr-scanner"
            element={
              <AdminRoute>
                <Scanner />
              </AdminRoute>
            }
          />

          <Route
            path="/scan/:token"
            element={
              <AdminRoute>
                {' '}
                <ScanPage />{' '}
              </AdminRoute>
            }
          />
        </Routes>
      </>
    </AppShell>
  );
};

export default App;
