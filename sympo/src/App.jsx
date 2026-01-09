import { useRef } from 'react';
import './App.css';

import Home from './screens/Home';
import About from './screens/About';
import Events from './screens/Events';
import FAQs from './screens/Faqs';
import Contact from './screens/Contacts';
import NavMenubar from './components/NavMenuBar';

const App = () => {
  const HomeRef = useRef(null);
  const AboutRef = useRef(null);
  const EventsRef = useRef(null);
  const FAQsRef = useRef(null);
  const ContactRef = useRef(null);
  return (
    <div>
      <NavMenubar
        HomeRef={HomeRef}
        AboutRef={AboutRef}
        EventsRef={EventsRef}
        FAQsRef={FAQsRef}
        ContactRef={ContactRef}
      />
      <div ref={HomeRef}>
        
          <Home />
 
      </div>
      <div ref={AboutRef}>
        <About />
      </div>
      <div ref={EventsRef}>
        <Events />
      </div>
      <div ref={FAQsRef}>
        <FAQs />
      </div>
      <div ref={ContactRef}>
        <Contact />
      </div>
    </div>
  );
};

export default App;
