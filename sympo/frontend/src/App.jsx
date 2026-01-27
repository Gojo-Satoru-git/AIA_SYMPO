import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef } from 'react';
import BackgroundEffect from './components/Bgeffect';
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
import Eventprovider from './context/Eventprovider';
import WorkshoProvider from './context/WorkshopProvider';

import { AuthProvider } from './context/AuthContext';
import AdminRoute from "./components/AdminRoute";
import ScanPage from './screens/ScanPage';

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
        <Eventprovider>
          <WorkshoProvider>
            <Events />
          </WorkshoProvider>
        </Eventprovider>
      </div>
      <div ref={RegisterRef}>
        <Register />
      </div>
      <div ref={FAQsRef}>
        <FAQs />
      </div>
      <div ref={ContactRef}>
        <Eventprovider>
          <Contact />
        </Eventprovider>
        
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
          <Route path="/" element={<MainPage />} />

          {/* Auth pages */}
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />

          {/* QR Routes */}
          <Route path="/scan/:token" element= { <AdminRoute> <ScanPage /> </AdminRoute>}/>
        </Routes>
      </>
    </AppShell>
  );
};

export default App;
