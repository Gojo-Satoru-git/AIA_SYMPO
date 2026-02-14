import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showLine, setShowLine] = useState(false);
  const [showLogos, setShowLogos] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

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
        className={`absolute left-2 top-8 z-40 flex hidden items-center gap-2 transition-all duration-1000 ease-out lg:flex ${showLogos ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} `}
      >
        <img
          src="/tekhora.jpeg"
          alt="AIA Logo"
          className="h-10 rounded-full object-contain sm:h-10 md:h-10"
        />
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 sm:text-sm sm:tracking-[0.15em] md:text-base md:tracking-[0.2em] lg:text-base lg:tracking-[0.1em]">
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

      <div className="mt-[44px] flex w-full max-w-5xl flex-col items-center justify-center text-center sm:mt-12 md:mt-16 lg:mt-24">
        <div className="inline-block">
          <h1
            className="relative animate-zoom text-4xl font-bold uppercase tracking-[0.3em] sm:mt-5 sm:text-5xl sm:tracking-widest md:text-7xl lg:mt-32 lg:text-8xl"
            style={{
              background: 'linear-gradient(180deg, #ff6b6b 0%, #e50914 40%, #7a0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `
                0 0 6px rgba(0,3,0,0.9),
                0 0 12px rgba(120,9,20,0.7),
                0 0 20px rgba(220,9,20,0.5)
              `,
              WebkitTextStroke: '2px red',
            }}
          >
            Tekhora'26
          </h1>

          <div
            className={`mt-4 h-[3px] origin-center bg-red-600 transition-transform duration-1000 sm:h-1 ${showLine ? 'scale-x-100 shadow-[0_0_10px_rgba(229,9,20,0.8),0_0_20px_rgba(229,9,20,0.6)] delay-500' : 'scale-x-0'} `}
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
