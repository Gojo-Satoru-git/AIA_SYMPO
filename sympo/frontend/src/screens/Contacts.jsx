import { Container, IconButton } from '@mui/material';
import ContactCard from '../components/contactcard';
import RegistrationCard from '../components/RegContactCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { eventcontext } from '../context/event.context';
import { useContext, useEffect, useRef, useState } from 'react';
import { workshopcontext } from '../context/workshop.context';

const Contacts = () => {
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [Selected, SetSelected] = useState('All');

  // Context Data
  const eventext = useContext(eventcontext);
  const Workshops = useContext(workshopcontext);

  const normalizeEvents = (data) =>
    data.map((item) => ({
      eventName: item.title,
      category: item.category,
      coordinators: [
        { name: item.contact?.name1, phone: item.contact?.phone1 },
        { name: item.contact?.name2, phone: item.contact?.phone2 },
      ],
    }));

  const formattedEvents = [...normalizeEvents(Workshops), ...normalizeEvents(eventext)];

  // Auto-scroll reset on filter change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [Selected]);

  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 120);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const filteredEvents =
    Selected === 'All'
      ? formattedEvents
      : formattedEvents.filter((event) => event.category?.toLowerCase() === Selected.toLowerCase());

  return (
    <div
      id="contacts"
      className="relative min-h-screen bg-transparent overflow-hidden pt-12 pb-24 font-serif selection:bg-red-900 selection:text-white"
    >
      <Container maxWidth="xl" className="relative z-30">
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-12 mt-12">
          <div className="inline-block border-b-2 border-red-600 pb-2 mb-4">
            <span className="text-red-500/60 font-mono text-xs tracking-[0.3em] uppercase">
              Tekhora // Personnel
            </span>
          </div>
          <h2 className="stranger-title text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700 font-bold uppercase tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            Event{' '}
            <span className="text-white flicker-strong drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              Coordinators
            </span>
          </h2>
          <p className="mt-4 text-blue-200/50 font-mono text-xs md:text-sm tracking-widest uppercase">
            &lt; Swipe to navigate &gt;
          </p>
        </div>

        {/* ================= FILTER "CHANNELS" ================= */}
        <div className="flex justify-center items-center mb-16">
          <div className="bg-black/40 backdrop-blur-md border border-red-900/30 p-2 rounded-full flex gap-2 md:gap-4">
            {['All', 'Technical', 'Non-Technical'].map((filter) => (
              <button
                key={filter}
                onClick={() => SetSelected(filter)}
                className={`
                  px-6 py-2 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300
                  ${
                    Selected === filter
                      ? 'bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-105 border border-red-500'
                      : 'text-red-500/60 hover:text-red-400 hover:bg-red-900/20 border border-transparent'
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ================= HORIZONTAL SCROLL AREA ================= */}
        <div className="relative group">
          {/* LEFT ARROW */}
          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 ml-2">
            <IconButton
              onClick={scrollLeft}
              className="bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              sx={{
                backgroundColor: 'black',
                border: '1px solid #dc2626',
                color: '#dc2626',
                '&:hover': {
                  backgroundColor: '#dc2626',
                  color: 'white',
                  boxShadow: '0 0 20px #dc2626',
                },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </div>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`
              flex gap-4 overflow-x-auto pb-12 px-4 pt-4
              hide-scrollbar scroll-smooth snap-x snap-mandatory
              ${isScrolling ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                // Removed the wrapping borders here because ContactCard now has its own styling
                className="transform transition-transform duration-300 snap-center"
              >
                <ContactCard eventName={event.eventName} coordinators={event.coordinators} />
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 mr-2">
            <IconButton
              onClick={scrollRight}
              className="bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              sx={{
                backgroundColor: 'black',
                border: '1px solid #dc2626',
                color: '#dc2626',
                '&:hover': {
                  backgroundColor: '#dc2626',
                  color: 'white',
                  boxShadow: '0 0 20px #dc2626',
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </div>

        {/* ================= REGISTRATION SECTION ================= */}
        <div className="mt-24 mb-12 border-t border-red-900/30 pt-16">
          <div className="text-center mb-12">
            <h2 className="stranger-title text-3xl md:text-5xl text-red-600 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
              Registration <span className="text-blue-200">Enquiries</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 px-4 margin-left-12">
            <RegistrationCard position="Registration Lead" name="Karthik M" phone="9876543210" />

            <RegistrationCard position="Registration Co-Lead" name="Anitha P" phone="9123456789" />

            <RegistrationCard position="Help Desk" name="Rahul S" phone="9988776655" />
          </div>
        </div>
      </Container>

      {/* --- CSS FX --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=ITC+Benguiat&display=swap');

        .stranger-title {
          font-family: 'ITC Benguiat', serif;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .flicker-strong {
          animation: flicker 3s linear infinite;
        }

        /* Updated to include Text-Shadow for REAL Glow */
        @keyframes flicker {
          0%,
          19.999%,
          22%,
          62.999%,
          64%,
          64.999%,
          70%,
          100% {
            opacity: 1;
            text-shadow:
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.4),
              0 0 30px rgba(220, 38, 38, 0.6); /* Hint of red in the white light */
          }
          20%,
          21.999%,
          63%,
          63.999%,
          65%,
          69.999% {
            opacity: 0.3;
            text-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Contacts;
