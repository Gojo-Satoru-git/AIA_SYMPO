import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Lock, Unlock, Zap, AlertTriangle, Fingerprint } from 'lucide-react';

/**
 * HOOK: useMousePosition
 * UPDATED: Now supports Touch events for mobile "flashlight" effect
 */
const useMousePosition = (ref) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Helper to calculate position relative to the element
    const updatePos = (clientX, clientY) => {
      const rect = element.getBoundingClientRect();
      setMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    };

    // MOUSE EVENTS
    const handleMouseMove = (e) => updatePos(e.clientX, e.clientY);
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    // TOUCH EVENTS (Mobile)
    const handleTouchMove = (e) => {
      // Prevent scrolling while "scanning" the card
      // e.preventDefault(); // Optional: uncomment if you want to lock scroll while touching card
      const touch = e.touches[0];
      updatePos(touch.clientX, touch.clientY);
    };
    const handleTouchStart = (e) => {
      setIsActive(true);
      const touch = e.touches[0];
      updatePos(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => setIsActive(false);

    // Add Listeners
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);

        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [ref]);

  return { mousePos, isActive };
};

/**
 * COMPONENT: Floating Ash Particle
 */
const AshParticle = ({ delay }) => (
  <div
    className="animate-float-ash pointer-events-none absolute rounded-full bg-white blur-[0.5px]"
    style={{
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: Math.random() * 0.5 + 0.2,
      animationDelay: `${delay}s`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    }}
  />
);

/**
 * MAIN COMPONENT
 */
const TosButton = ({ onClick, ...props }) => {
  const buttonRef = useRef(null);
  const { mousePos, isActive } = useMousePosition(buttonRef);
  const [isClicked, setIsClicked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Scroll Reaction Logic
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      window.location.href = '/tos';
    }, 800);
    if (onClick) onClick(e);
  };

  const rotation = Math.min(scrollY * 0.02, 5);
  // Smaller flashlight mask on mobile for better precision
  const MASK_SIZE = typeof window !== 'undefined' && window.innerWidth < 768 ? 250 : 400;

  return (
    <div
      className="perspective-1000 group relative flex w-full justify-center p-4 md:p-10"
      style={{
        transform: `rotateX(${rotation}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Styles & Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        @keyframes float-ash {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(40px) rotate(180deg); opacity: 0; }
        }
        @keyframes scanline {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes flicker {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% { opacity: 1; }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% { opacity: 0.3; }
        }
        @keyframes shake-hard {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-3px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-float-ash { animation: float-ash linear infinite; }
        .animate-scanline { animation: scanline 4s linear infinite; }
        .animate-flicker { animation: flicker 4s infinite; }
        .animate-shake-hard { animation: shake-hard 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .perspective-1000 { perspective: 1000px; }
        .text-glow-red { text-shadow: 0 0 20px rgba(220, 38, 38, 0.8), 0 0 10px rgba(0,0,0,0.8); }
        .font-cinematic { font-family: 'Playfair Display', serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* === BUTTON CONTAINER === */}
      {/* CHANGES: 
         1. h-[500px] for mobile (vertical), md:h-[340px] for desktop (horizontal)
         2. active:scale-[0.98] gives feedback on mobile tap
      */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isClicked}
        className={`relative h-[500px] w-full max-w-sm overflow-hidden rounded-xl bg-black outline-none ring-1 ring-zinc-800 transition-all duration-500 ease-out active:scale-[0.98] group-hover:scale-[1.02] group-hover:ring-zinc-600 md:h-[340px] md:max-w-3xl ${isClicked ? 'animate-shake-hard ring-red-500' : ''}`}
        style={{
          boxShadow: isActive
            ? '0 20px 50px -12px rgba(0, 0, 0, 1)'
            : '0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
        {...props}
      >
        {/* === LAYER 1: THE "LAB" (Top/Idle Layer) === */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between bg-zinc-950 p-6 md:p-8"
          style={{
            // The Flashlight Mask
            maskImage: isActive
              ? `radial-gradient(${MASK_SIZE}px circle at ${mousePos.x}px ${mousePos.y}px, transparent 20%, black 60%)`
              : 'none',
            WebkitMaskImage: isActive
              ? `radial-gradient(${MASK_SIZE}px circle at ${mousePos.x}px ${mousePos.y}px, transparent 20%, black 60%)`
              : 'none',
          }}
        >
          {/* Background Details: Grid & Scanlines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="animate-scanline pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] opacity-20" />

          {/* Header: Status Bar */}
          <div className="relative z-10 flex w-full items-start justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded border bg-zinc-900 ${isActive ? 'border-red-500/50 text-red-500' : 'border-zinc-700 text-zinc-500'}`}
              >
                {isActive ? <Unlock size={14} /> : <Lock size={14} />}
              </div>
              <div className="font-tech text-left text-[10px] tracking-widest text-zinc-500 md:text-xs">
                SECURE_CONNECTION //{' '}
                <div className={isActive ? 'animate-pulse text-red-500' : 'text-emerald-500'}>
                  {isActive ? 'UNSTABLE' : 'ESTABLISHED'}
                </div>
              </div>
            </div>
            <div className="font-tech text-[10px] text-zinc-600">V.1.0.0</div>
          </div>

          {/* Center Content: The Call to Action */}
          <div className="relative z-10 mt-4 flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Protocol 99
              </span>
            </div>
            {/* CHANGED: Text sizing for mobile */}
            <h2 className="text-left text-3xl font-bold tracking-tighter text-zinc-200 md:text-4xl">
              MYSTERY <br className="md:hidden" /> <span className="text-zinc-600">PROMOTION</span>
            </h2>
            <p className="font-tech max-w-sm text-left text-xs leading-relaxed text-zinc-500 md:text-sm">
              This link takes you to an event's page.{' '}
              <span className="hidden md:inline">Hover</span>
              <span className="md:hidden">Touch</span> to scan surface integrity. Click to breach
              containment.
            </p>
          </div>

          {/* Bottom: Action Arrow */}
          <div className="relative z-10 flex w-full items-end justify-between pt-4">
            <div className="flex items-center space-x-2 text-zinc-700">
              <Fingerprint size={32} strokeWidth={1} />
              <span className="font-tech text-[10px] opacity-50">BIOMETRIC SCAN</span>
            </div>

            <div className="flex items-center transition-transform duration-300 group-hover:translate-x-1">
              <span
                className={`font-tech mr-4 text-[10px] font-bold tracking-widest text-red-500 transition-opacity duration-300 md:text-xs ${isActive ? 'opacity-100' : 'opacity-0'}`}
              >
                BREACH DETECTED
              </span>
              <div
                className={`rounded-full p-2 transition-colors duration-300 ${isActive ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}
              >
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* === LAYER 2: THE "UPSIDE DOWN" (Revealed Layer) === */}
        <div
          className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-black"
          style={{
            // If clicked, full reveal. If active, flashlight mask.
            maskImage: isClicked
              ? `radial-gradient(2000px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
              : isActive
                ? `radial-gradient(${MASK_SIZE}px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 70%)`
                : 'none',
            WebkitMaskImage: isClicked
              ? `radial-gradient(2000px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
              : isActive
                ? `radial-gradient(${MASK_SIZE}px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 70%)`
                : 'none',
            opacity: isActive || isClicked ? 1 : 0,
            transition: isClicked ? 'all 0.4s ease-in' : 'opacity 0.15s ease-out',
          }}
        >
          {/* 2.1: Organic Background Texture (CSS Only) */}
          <div className="absolute inset-0 bg-red-950">
            {/* CSS Noise Pattern */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-red-900/40 to-black" />
          </div>
          <div className="absolute inset-0 bg-[url('/assets/mindflayer.png')]" />

          {/* 2.2: The Veins (SVG) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-30 mix-blend-color-dodge"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="turbulence-veins">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="30" />
            </filter>
            <circle
              cx="50%"
              cy="50%"
              r="70%"
              stroke="rgba(255, 0, 0, 0.5)"
              strokeWidth="2"
              fill="transparent"
              filter="url(#turbulence-veins)"
            />
            <circle
              cx="50%"
              cy="50%"
              r="50%"
              stroke="rgba(200, 50, 50, 0.4)"
              strokeWidth="4"
              fill="transparent"
              filter="url(#turbulence-veins)"
            />
          </svg>

          {/* 2.3: Ash Particles */}
          {(isActive || isClicked) &&
            Array.from({ length: 60 }).map((_, i) => <AshParticle key={i} delay={i * 0.05} />)}

          {/* 2.4: Content (The Reveal) */}
          <div className="relative z-50 flex scale-110 transform flex-col items-center justify-center px-4 text-center">
            <div className="mb-2 flex items-center space-x-4 opacity-80">
              <Zap className="animate-flicker fill-red-400 text-red-400" size={20} />
              <span className="font-tech text-xs uppercase tracking-[0.5em] text-red-300">
                Anomaly Detected
              </span>
              <Zap
                className="animate-flicker fill-red-400 text-red-400"
                size={20}
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* CHANGED: Text sizing for mobile */}
            <h1 className="font-cinematic text-glow-red text-4xl leading-tight text-red-100 md:text-5xl lg:text-6xl">
              TOURNAMENT
            </h1>
            <h1 className="font-cinematic text-glow-red text-2xl opacity-90 md:text-4xl lg:text-5xl">
              OF STRATEGIES
            </h1>

            <div className="mt-6 flex animate-pulse items-center space-x-2 border-t border-red-500/30 pt-4">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="font-tech text-xs font-bold uppercase tracking-widest text-red-200">
                Click to Visit
              </span>
            </div>
          </div>

          {/* 2.5: Flashlight Chromatic Edge (The Glass Effect) */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              background: `radial-gradient(${MASK_SIZE}px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1) 0%, rgba(255,0,0,0.2) 80%, transparent 100%)`,
            }}
          />
        </div>
      </button>

      {/* Floor Reflection */}
      <div
        className="pointer-events-none absolute -bottom-[40px] z-0 h-[60px] w-[90%] scale-y-[-1] transform bg-gradient-to-t from-red-500/20 to-transparent opacity-20 blur-xl transition-opacity duration-300"
        style={{ opacity: isActive ? 0.4 : 0.1 }}
      />
    </div>
  );
};

export default TosButton;
