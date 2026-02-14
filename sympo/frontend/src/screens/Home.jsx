import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCounter from '../components/EventCounter';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const TARGET_DATE = new Date('2026-02-21T09:30:00');
  const [showLine, setShowLine] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showLogos, setShowLogos] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const calculateSecondsLeft = () => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();
    return Math.max(0, Math.floor(difference / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft());

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  useEffect(() => {
    // 1. Initial delay for the "Tekhora" zoom animation
    const lineTimer = setTimeout(() => setShowLine(true), 1000);

    // 2. Delay for the counter (Wait for title + line animation to finish)
    // Adjust 2500ms based on your 'animate-zoom' duration
    const counterTimer = setTimeout(() => setShowCounter(true), 2200);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(counterTimer);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowLine(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogos(true);
      setShowDescription(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-10">
      <div
        className={`absolute left-6 top-8 z-40 flex hidden items-center gap-3 transition-all duration-1000 ease-out lg:flex ${showLogos ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} `}
      >
        <img
          src="/tekhora.jpeg"
          alt="AIA Logo"
          className="h-10 rounded-full object-contain sm:h-12 md:h-16"
        />
        <span className="ml-2 text-sm font-bold uppercase tracking-[0.3em] text-white sm:text-base md:text-xl lg:text-3xl">
          TEKHORA
        </span>
      </div>

      <div
        className={`m= absolute left-1/2 top-[70px] z-40 -translate-x-1/2 transform transition-all duration-1000 ease-out sm:top-[120px] md:left-auto md:right-10 md:top-[110px] md:translate-x-0 ${showLogos ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} w-full max-w-lg px-4`}
      >
        <div className="flex scale-[0.8] flex-wrap justify-center gap-2 sm:scale-100 md:flex-nowrap md:justify-end">
          <img src="/AU.png" alt="Logo 1" className="h-16 object-contain sm:h-14 md:h-20" />
          <img src="/MIT.png" alt="Logo 2" className="h-16 object-contain sm:h-16 md:h-20" />

          <img
            src="/MIT75 (1).png"
            alt="Logo 3"
            className="h-16 rounded-full object-contain sm:h-16 md:h-20"
          />

          <img
            src="/AIA.png"
            alt="Logo 4"
            className="h-16 w-full object-contain sm:h-16 md:h-20 md:w-auto"
          />
        </div>
      </div>
      <div className="absolute left-1/2 top-[25%] z-30 -translate-x-1/2 sm:top-[35%] lg:top-[17%]">
        <AnimatePresence>
          {showCounter && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative rounded-xl border border-red-900/30 bg-black/40 p-3 shadow-[0_0_30px_rgba(122,0,0,0.15)] backdrop-blur-sm sm:p-4"
            >
              <EventCounter
                value={secondsLeft}
                fontSize={typeof window !== 'undefined' && window.innerWidth < 640 ? 32 : 32}
                textColor="#ff6b6b"
              />
              <div className="mt-1 flex justify-between px-1 text-[8px] font-black uppercase tracking-[0.2em] text-red-500/60 sm:text-[10px]">
                <span>Days</span>
                <span>Hrs</span>
                <span>Min</span>
                <span>Sec</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-[40px] flex w-full max-w-5xl flex-col items-center justify-center text-center sm:mt-12 md:mt-16 lg:mt-20">
        <div className="inline-block">
          <h1
            className="relative animate-zoom text-4xl font-bold uppercase tracking-[0.3em] sm:mt-5 sm:text-5xl sm:tracking-widest md:text-7xl lg:mt-12 lg:text-8xl"
            style={{
              background: 'linear-gradient(180deg, #ff6b6b 0%, #e50914 40%, #7a0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `
          0 0 6px rgba(0,3,0,0.9),
          0 0 12px rgba(120,9,20,0.7),
          0 0 20px rgba(220,9,20,0.5)
        `,
              WebkitTextStroke: '2px rgba(255,0,0,0.5)',
            }}
          >
            Tekhora'26
          </h1>

          <div
            className={`mt-4 h-[3px] origin-center bg-red-600 transition-transform duration-1000 sm:h-1 ${
              showLine
                ? 'scale-x-100 shadow-[0_0_10px_rgba(229,9,20,0.8),0_0_20px_rgba(229,9,20,0.6)] delay-500'
                : 'scale-x-0'
            } `}
          />
        </div>
        <p
          className={`mt-6 max-w-3xl text-center text-sm text-white/80 transition-all duration-1000 ease-out sm:text-base md:text-lg lg:text-2xl ${showDescription ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} `}
        >
          Intercollegiate tech symposium, hosted by MIT's Artificial Intelligence Association.
        </p>

        <p
          className={`mt-8 text-center text-xs uppercase tracking-[0.3em] text-red-600 transition-all delay-150 duration-1000 ease-out sm:text-2xl md:text-base lg:text-4xl ${showDescription ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} `}
        >
          February
        </p>

        <p
          className={`mt-1 text-center text-sm font-semibold tracking-widest text-white transition-all delay-300 duration-1000 ease-out sm:text-2xl md:text-lg lg:text-4xl ${showDescription ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} `}
        >
          21 &amp; 22
        </p>
        <div className="h-6 sm:h-10" />
        <div
          onClick={() => {
            document.getElementById('Events')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className={`cursor-pointer select-none transition-all duration-700 ease-out sm:mt-6 lg:mt-0 ${showDescription ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
        >
          <div className="flex animate-pulse items-center gap-4 rounded-xl border-2 border-red-600 px-3 py-2 shadow-[0_0_16px_rgba(229,9,20,0.8)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,9,20,1)] sm:px-6 sm:py-4">
            <span className="animate-bounce text-2xl text-red-600">↓</span>

            <span className="text-center text-[10px] font-semibold uppercase tracking-[0.10em] text-red-600 transition-colors duration-300 hover:text-white sm:text-sm sm:tracking-[0.35em] md:text-base lg:text-lg">
              Enter the HellFire
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
