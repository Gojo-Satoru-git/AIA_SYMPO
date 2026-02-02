import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Calendar,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle,
  Lock,
  Copy,
} from 'lucide-react';
import useToast from '../context/useToast';
import useCart from '../context/useCart';
import TeamForm from './teamForm';

// Constants to avoid magic strings
const TEAM_EVENT_IDS = ['12', '13'];

function EventDetails({ card, onClose, checkPurchase, addToCart }) {
  const { showToast } = useToast();
  const { checkCart, isEventCoveredByPass } = useCart();

  const [showArrow, setShowArrow] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const requiresTeam = TEAM_EVENT_IDS.includes(card.id);
  const [showAddTeamBtn, setShowAddTeamBtn] = useState(requiresTeam);

  const isPurchased = checkPurchase(card);
  const isInCart = checkCart(card);

  // Button logic
  const buttonState = useMemo(() => {
    if (isPurchased)
      return {
        text: 'Access Granted',
        class: 'bg-gray-800 text-green-500 border-green-500/50 cursor-not-allowed',
        icon: <CheckCircle size={18} />,
        disabled: true,
      };
    if (isInCart)
      return {
        text: 'In Cart',
        class: 'bg-orange-900/20 text-orange-500 border-orange-500/50 cursor-not-allowed',
        icon: <Lock size={18} />,
        disabled: true,
      };
    return {
      text: 'Register Subject',
      class:
        'bg-red-600/20 text-red-500 border-red-600 hover:bg-red-600 hover:text-black hover:shadow-[0_0_20px_rgba(220,38,38,0.7)]',
      icon: null,
      disabled: false,
    };
  }, [isPurchased, isInCart]);

  const scrollRef = useRef(null);

  // Scroll detection
  const checkOverflow = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowArrow(
        scrollHeight > clientHeight && Math.abs(scrollHeight - clientHeight - scrollTop) > 5
      );
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    if (el) el.addEventListener('scroll', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      if (el) el.removeEventListener('scroll', checkOverflow);
    };
  }, [card]);

  const handleMainAction = () => {
    if (isEventCoveredByPass(card.id)) {
      showToast('Event covered by your Pass. Access Granted.', 'success');
      return;
    }
    if (requiresTeam && localStorage.getItem(`${card.title}-teamData`) === null) {
      showToast('⚠️ Protocol Missing: Submit Team Details first.', 'error');
      return;
    }
    if (!checkCart(card)) {
      addToCart(card, card.category);
      showToast(`${card.title} added to containment unit.`, 'success');
    } else {
      showToast(`${card.title} is already in the cart.`, 'info');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Phone number copied!', 'success');
  };

  return (
    <AnimatePresence mode="wait">
      {showForm && requiresTeam ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-full"
        >
          <TeamForm
            title={card.title}
            teamSize={card.teamSize}
            mini={card.miniTeamSize}
            setShowAdd={setShowAddTeamBtn}
            onclose={() => setShowForm(false)}
            isDisabledAll={isPurchased}
          />
        </motion.div>
      ) : (
        <motion.div
          key="details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full max-w-5xl mx-auto mt-6 md:mt-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 md:-right-4 text-red-500 hover:text-red-300 transition-colors z-50 group flex items-center gap-2"
          >
            <span className="opacity-0 group-hover:opacity-100 font-mono text-xs tracking-widest uppercase transition-opacity">
              Abort
            </span>
            <div className="bg-black/80 border border-red-500/50 rounded-full p-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <X size={20} />
            </div>
          </button>

          {/* Main Container - "The Case File" */}
          <div className="bg-[#0a0a0a] border border-red-900/60 rounded-xl shadow-[0_0_60px_rgba(220,38,38,0.1)] overflow-hidden relative flex flex-col max-h-[85vh]">
            {/* Atmospheric Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-70"></div>

            <div
              ref={scrollRef}
              className="relative z-10 overflow-y-auto custom-scrollbar p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              {/* --- LEFT COLUMN: VISUALS (4 cols) --- */}
              <div className="md:col-span-4 flex flex-col gap-5">
                <div className="relative group rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 p-3 rounded flex flex-col items-center justify-center text-center">
                    <Users size={18} className="text-red-500 mb-1" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">
                      Team Size
                    </span>
                    <span className="text-lg font-bold text-gray-200">{card.teamSize}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded flex flex-col items-center justify-center text-center">
                    <Calendar size={18} className="text-red-500 mb-1" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">
                      Date
                    </span>
                    <span className="text-sm font-bold text-gray-200">{card.date}</span>
                  </div>
                </div>
              </div>

              {/* --- RIGHT COLUMN: INTEL (8 cols) --- */}
              <div className="md:col-span-8 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-200 to-white tracking-tighter drop-shadow-lg font-serif mb-3">
                    {card.title}
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed border-l-2 border-red-600/50 pl-4 py-1">
                    {card.description}
                  </p>
                </div>

                {/* Contacts & Time Grid */}
                <div className="bg-black/40 p-4 rounded border border-gray-800 mb-8 flex flex-row flex-wrap gap-8">
                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-red-600 mt-1" />
                    <div>
                      <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest mb-1">
                        Timeline
                      </span>
                      <span className="text-gray-200 font-bold">{card.time}</span>
                    </div>
                  </div>

                  {/* Contact 1 */}
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-red-600 mt-1" />
                    <div>
                      <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest mb-1">
                        Lead Contact
                      </span>
                      <span className="block text-gray-200 font-bold text-sm">
                        {card.contact.name1}
                      </span>
                      <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
                        {card.contact.phone1}
                        <button
                          onClick={() => copyToClipboard(card.contact.phone1)}
                          className="hover:text-white transition-colors p-1"
                          title="Copy Number"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contact 2 (Conditional) */}
                  {card.contact.name2 && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-red-600 mt-1" />
                      <div>
                        <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest mb-1">
                          Secondary
                        </span>
                        <span className="block text-gray-200 font-bold text-sm">
                          {card.contact.name2}
                        </span>
                        <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
                          {card.contact.phone2}
                          <button
                            onClick={() => copyToClipboard(card.contact.phone2)}
                            className="hover:text-white transition-colors p-1"
                            title="Copy Number"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    disabled={buttonState.disabled}
                    onClick={handleMainAction}
                    className={`flex-1 py-3 px-6 rounded text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${buttonState.class}`}
                  >
                    {buttonState.icon} {buttonState.text}
                  </button>

                  {requiresTeam && (
                    <button
                      className={`py-3 px-6 rounded border text-sm font-bold uppercase tracking-widest transition-all duration-300 
                            ${
                              !showAddTeamBtn || isInCart || isPurchased
                                ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                                : 'border-purple-500/50 text-purple-400 hover:bg-purple-900/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                            }`}
                      onClick={() => !isPurchased && setShowForm(true)}
                    >
                      {isPurchased ? 'Team Locked' : 'Manage Team'}
                    </button>
                  )}
                </div>

                {/* SCROLLABLE RULES TERMINAL */}
                <div className="flex-grow min-h-0 flex flex-col mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-yellow-600/80 font-mono text-xs uppercase tracking-widest">
                    <AlertTriangle size={14} /> Mission Protocols
                  </div>

                  <div className="bg-black/60 border border-gray-800 rounded p-4 h-48 md:h-auto overflow-y-auto custom-scrollbar shadow-inner relative">
                    {/* Scanline overlay for the rules box specifically */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

                    <div className="relative z-10 text-gray-400 text-sm space-y-2 font-mono leading-relaxed">
                      {/* Assuming card.rules is a string. If it's long, this box handles the scroll internally */}
                      <p className="whitespace-pre-line">{card.rules}</p>

                      {/* Fake terminal cursor at the end */}
                      <span className="inline-block w-2 h-4 bg-red-500/50 animate-pulse align-middle ml-1"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Scroll Indicator (only appears if the whole modal overflows) */}
            {showArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-20"
              >
                <div className="text-red-500/80 text-[10px] font-mono uppercase tracking-widest bg-black/80 px-2 rounded-full border border-red-900">
                  Scroll Down
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EventDetails;
