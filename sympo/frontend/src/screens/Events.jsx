import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Contexts & Components
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
import { eventcontext } from '../context/event.context';
import { workshopcontext } from '../context/workshop.context';
import { usePurchases } from '../context/PurchaseContext';
import useCart from '../context/useCart';

// --- HELPER: GLITCH TEXT ---
const GlitchText = ({ text }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-600 opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-600 opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[-2px]">
        {text}
      </span>
    </div>
  );
};

const Events = () => {
  // --- STATE ---
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState({ id: null, category: null });

  // Context Data
  const { addToCart } = useCart();
  const { checkPurchases } = usePurchases();
  const eventList = useContext(eventcontext);
  const workshopList = useContext(workshopcontext);

  // --- LOGIC ---

  // Modal Body Lock
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Data Filtering
  const displayedEvents =
    selectedFilter === 'All' ? eventList : eventList.filter((e) => e.category === selectedFilter);

  // Resolve Modal Details
  let activeDetail = null;
  if (selectedCardData.id !== null) {
    activeDetail =
      selectedCardData.category === 'workshop'
        ? workshopList.find((w) => w.id === selectedCardData.id)
        : eventList.find((e) => e.id === selectedCardData.id);
  }

  const openModal = (id, category) => {
    setSelectedCardData({ id, category });
    setModalOpen(true);
  };

  const handleAddToCart = (item, type) => {
    const price = Number(item.fees);
    addToCart({
      id: item.id,
      title: item.title,
      price: Number.isFinite(price) ? price : 0,
      type,
      isSignature: item.isSignature === true,
    });
  };

  return (
    <div className="relative min-h-screen bg-transparent text-red-500 overflow-x-hidden selection:bg-red-900 selection:text-white pb-24">
      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col p-6 md:p-10 max-w-[1600px] mx-auto">
        {/* 1. HEADER & NAVIGATION (CENTERED) */}
        <div className="flex flex-col items-center justify-center mb-16 mt-12 gap-8 text-center">
          <div>
            <h3 className="text-xs font-mono text-red-400/50 tracking-[0.4em] uppercase mb-4">
              Tekhora // Archive
            </h3>
            <h1 className="text-5xl md:text-7xl font-[StrangerThings] text-transparent bg-clip-text bg-gradient-to-b from-red-700 to-red-800">
              EVENTS
            </h1>
          </div>

          {/* Filter Panel */}
          <div className="p-1 bg-black/80 border border-red-900/40 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.15)] backdrop-blur-md">
            <div className="flex relative">
              {['All', 'Technical', 'Non-Technical'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`
                                relative px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 z-10 rounded-full
                                ${selectedFilter === tab ? 'text-white text-shadow-glow' : 'text-red-800/70 hover:text-red-500'}
                            `}
                >
                  {tab}
                  {selectedFilter === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-red-600/80 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] -z-10 border border-red-500/50"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. MAIN EVENT GRID */}
        <section className="min-h-[500px]">
          {/* FLEX GRID SYSTEM: 
               - flex-wrap: Allows wrapping.
               - justify-center: Centers the last row if it has few items.
               - -m-2: Negative margin on container counteracts padding on items.
            */}
          <motion.div layout className="flex flex-wrap justify-center gap-4">
            <AnimatePresence mode="popLayout">
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
                >
                  <div className="transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)] transition-all duration-300 h-full">
                    <Eventcard
                      {...event}
                      index={index}
                      onClick={() => openModal(event.id, event.category)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayedEvents.length === 0 && (
            <div className="w-full text-center py-32 text-red-500/40 font-mono border-2 border-dashed border-red-900/20 rounded-lg mt-10">
              [ ERROR: DATA NOT FOUND IN ARCHIVE ]
            </div>
          )}
        </section>

        {/* 3. SIGNATURE WORKSHOPS (Same Grid Structure) */}
        <section className="relative border-t border-red-900/20 pt-20 mt-24">
          {/* Section Header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-8 py-2">
            <h2 className="text-2xl md:text-4xl font-[StrangerThings] text-gray-300 tracking-wide drop-shadow-md">
              Signature <span className="text-red-700">Events</span>
            </h2>
          </div>

          <div className="relative group mt-12">
            {/* Applied the exact same Flexbox Grid structure here 
                   to ensure 4 columns and centered last row 
                */}
            <motion.div layout className="flex flex-wrap justify-center align-center">
              {workshopList.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
                >
                  <div className="transform hover:-translate-y-2 transition-all duration-300 h-full">
                    <Eventcard
                      {...workshop}
                      index={index}
                      category="workshop"
                      onClick={() => openModal(workshop.id, 'workshop')}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setModalOpen(false);
                setSelectedCardData({ id: null, category: null });
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-7xl rounded-xl border border-red-900/30 bg-transparent shadow-[0_0_40px_rgba(0,0,0,0.8)] relative my-auto"
            >
              <EventDetails
                card={activeDetail}
                itemCategory={selectedCardData.category}
                onClose={() => setModalOpen(false)}
                checkPurchase={checkPurchases}
                addToCart={handleAddToCart}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Events;
