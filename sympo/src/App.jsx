import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef } from "react";

import Home from "./screens/Home";
import About from "./screens/About";
import Events from "./screens/Events";
import FAQs from "./screens/Faqs";
import Contact from "./screens/Contacts";
import Register from "./screens/Register";
import Footer from "./components/footer";
import NavMenubar from "./components/NavMenuBar";
import Auth from "./screens/Auth";

const MainPage = () => {
  const HomeRef = useRef(null);
  const AboutRef = useRef(null);
  const EventsRef = useRef(null);
  const FAQsRef = useRef(null);
  const ContactRef = useRef(null);
  const RegisterRef = useRef(null);

  return (
    <div className="bg-black">
      <NavMenubar
        HomeRef={HomeRef}
        AboutRef={AboutRef}
        EventsRef={EventsRef}
        FAQsRef={FAQsRef}
        ContactRef={ContactRef}
        RegisterRef={RegisterRef}
      />

      <div ref={HomeRef}><Home /></div>
      <div ref={AboutRef}><About /></div>
      <div ref={EventsRef} id="Events"><Events /></div>
      <div ref={RegisterRef}><Register /></div>
      <div ref={FAQsRef}><FAQs /></div>
      <div ref={ContactRef}><Contact /></div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
   
      <Routes>
        {/* Scroll-based landing page */}
        <Route path="/" element={<MainPage />} />

        {/* Auth pages */}
        <Route path="/signin" element={<Auth mode="signin" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
      </Routes>
   
  );
};

export default App;
