import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What is the symposium?',
    a: 'The symposium is a technical event organized by the department, featuring competitions, talks, and workshops designed to enhance technical and practical skills.',
  },
  {
    q: 'Who can participate?',
    a: 'Students from all colleges and departments are welcome to participate unless an event specifies eligibility criteria.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Some events may have a minimal registration fee. Details will be provided during registration.',
  },
  {
    q: 'Will participants receive certificates?',
    a: 'Yes, certificates will be provided to all registered participants and winners where applicable.',
  },
  {
    q: 'How do I register?',
    a: 'Registration links will be available on the symposium website under the Events section.',
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-transparent text-red-500 font-serif overflow-hidden selection:bg-red-900 selection:text-white">
      <div className="relative z-30 container mx-auto max-w-7xl px-8 py-24 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* --- LEFT: THE HOOK (TITLE) --- */}
        <div className="lg:sticky lg:top-24 flex-1">
          <div className="relative border-l-4 border-red-600 pl-8 py-2">
            <h3 className="text-white/60 font-mono text-sm tracking-widest mb-4 uppercase">
              Tekhora // Classified
            </h3>
            <h2 className="stranger-title text-5xl md:text-7xl font-bold uppercase leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
              Things That <br />
              Might Be <br />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flicker-slow">
                Bugging
              </span>{' '}
              <br />
              You Out
            </h2>
          </div>
          <p className="mt-8 text-red-200/60 max-w-md font-mono text-lg leading-relaxed">
            Do not enter the upside down without knowledge. Here lies the answers you seek, before
            the gate closes forever.
          </p>
        </div>

        {/* --- RIGHT: THE CONTENT (ACCORDION) --- */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`
                  group relative w-full
                  transition-all duration-500 ease-out
                `}
              >
                {/* Glowing Border Container */}
                <div
                  className={`
                    absolute -inset-0.5 rounded-lg opacity-75 blur-sm transition-all duration-500
                    ${isOpen ? 'bg-red-600/30 opacity-100 blur-sm' : 'bg-gradient-to-r from-red-900/0 via-red-900/40 to-red-900/0 opacity-0 group-hover:opacity-100'}
                  `}
                />

                {/* Main Card */}
                <div className="relative bg-black border border-red-900/30 rounded-lg overflow-hidden backdrop-blur-sm">
                  {/* Question Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span
                      className={`
                        text-lg md:text-xl font-bold tracking-wider uppercase transition-all duration-300
                        ${isOpen ? 'text-red-500' : 'text-red-100/70 group-hover:text-red-400'}
                      `}
                    >
                      {item.q}
                    </span>

                    {/* Animated Icon */}
                    <div
                      className={`
                      relative flex items-center justify-center w-8 h-8 rounded-full border border-red-500/30
                      transition-all duration-300
                      ${isOpen ? 'bg-red-900/80 border-red-500 rotate-180' : 'bg-transparent'}
                    `}
                    >
                      {isOpen ? (
                        <Minus size={16} className="text-white" />
                      ) : (
                        <Plus
                          size={16}
                          className="text-red-500 group-hover:text-white transition-colors"
                        />
                      )}
                    </div>
                  </button>

                  {/* Answer Content - Smooth Framer Motion Reveal */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-4 opacity-50" />
                          <p className="font-mono text-blue-100/80 leading-relaxed text-sm md:text-base">
                            {item.a}
                          </p>
                          {/* Decorative "Data" elements */}
                          <div className="flex gap-4 mt-4 text-[10px] uppercase tracking-[0.2em] text-red-600/40 font-mono">
                            <span>Vol. 0{index + 1}</span>
                            <span>//</span>
                            <span>Ref: 198{3 + index}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- CSS FX --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=ITC+Benguiat&display=swap');

        /* Fallback if you don't actually have Benguiat linked, usually Serif works well enough */
        .stranger-title {
          font-family: 'ITC Benguiat', serif;
        }

        .film-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }

        .flicker-slow {
          animation: flicker 3s linear infinite;
        }

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
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          }
          20%,
          21.999%,
          63%,
          63.999%,
          65%,
          69.999% {
            opacity: 0.4;
            text-shadow: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQs;
