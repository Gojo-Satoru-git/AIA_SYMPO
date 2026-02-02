import { MapPin, Mail, Instagram, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black text-gray-300 overflow-hidden border-t border-red-900/30">
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* ================= LEFT: THE SURVEILLANCE MAP ================= */}
          <div className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]" />
              <h3 className="text-red-300 font-mono tracking-[0.2em] text-sm uppercase">
                Tekhora // Surveillance
              </h3>
            </div>

            {/* MAP CONTAINER */}
            <div className="group relative w-full aspect-video rounded-lg overflow-hidden border border-red-900/40 bg-[#050505] shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] hover:border-red-600">
              {/* 1. CRT Scanlines (Disappear on Hover) */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

              {/* 2. Red Night Vision Overlay (Disappears on Hover) */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-red-900/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />

              {/* 3. The Map Iframe */}
              <iframe
                title="Madras Institute of Technology"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.366634572679!2d80.13709327485395!3d12.948375387364827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fac595c29ff%3A0xb76082ae18b51418!2sMadras%20Institute%20of%20Technology%2C%20Anna%20University!5e0!3m2!1sen!2sin!4v1768108284805!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="
                  w-full h-full 
                  transition-all duration-700 ease-in-out
                  filter grayscale contrast-[1.2] brightness-75 sepia-[.3] hue-rotate-[-50deg]
                  group-hover:filter-none group-hover:brightness-100 group-hover:contrast-100
                "
              />

              {/* 4. "REC" Badge (Top Right) */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/80 px-3 py-1 rounded border border-red-500/20 group-hover:opacity-0 transition-opacity duration-300">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-blink" />
                <span className="text-[10px] text-red-500 font-bold tracking-widest font-mono">
                  REC
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: DATA & SOCIALS ================= */}
          <div className="flex flex-col items-center lg:items-start gap-10">
            {/* 1. SOCIAL BUTTON (The Mind Flayer Heartbeat) */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <h3 className="font-bold uppercase text-2xl text-white mb-6 tracking-wide drop-shadow-lg">
                Join the <span className="text-red-600 font-bold">Party</span>
              </h3>

              <a
                href="https://www.instagram.com/aia_mit/"
                target="_blank"
                rel="noreferrer"
                className="
                  relative group
                  flex items-center gap-4 px-8 py-4
                  bg-gradient-to-r from-red-950 via-black to-red-950
                  border border-red-600
                  rounded-full
                  transition-all duration-300
                  hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]
                  overflow-hidden
                  animate-gradient-silk
                "
              >
                {/* Glow Animation Background */}
                <div className="absolute inset-0 bg-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border border-red-500 opacity-50 animate-ping-slow" />

                <div className="relative z-10 p-2 bg-red-600 rounded-full text-white shadow-[0_0_15px_rgba(255,0,0,0.8)]">
                  <Instagram size={24} />
                </div>

                <div className="relative z-10 flex flex-col text-left">
                  <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase">
                    Instagram
                  </span>
                  <span className="text-lg font-bold text-white tracking-widest group-hover:text-red-100">
                    @aia_mit
                  </span>
                </div>

                <ExternalLink
                  size={16}
                  className="relative z-10 ml-4 text-red-500 opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

            {/* 2. LOCATION INFO */}
            <div className="text-center lg:text-left space-y-6">
              <div className="group">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <MapPin className="text-red-600 w-5 h-5 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  <h4 className="font-bold uppercase tracking-widest text-lg text-gray-200">
                    Base of Operations
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-sans mx-auto lg:mx-0 group-hover:text-white transition-colors duration-300">
                  Madras Institute of Technology,
                  <br />
                  Chromepet, Chennai – 600044
                </p>
              </div>

              <div className="group">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <Mail className="text-red-600 w-5 h-5 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  <h4 className="font-bold uppercase tracking-widest text-lg text-gray-200">
                    Encrypted Channel
                  </h4>
                </div>
                <a
                  href="mailto:example@example.com"
                  className="text-gray-400 text-sm font-sans hover:text-red-400 hover:underline decoration-red-600 underline-offset-4 transition-all"
                >
                  example@example.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="mt-20 pt-8 border-t border-red-900/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          <div>
            <span className="text-red-900">ID:</span> 011-MIT-AIA
          </div>
          <div>© {new Date().getFullYear()} AIA Symposium.</div>
        </div>
      </div>

      {/* --- CSS FX --- */}
      <style jsx>{`
        /* 2. Animations */
        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        .animate-gradient-silk {
          /* Stranger Things Theme: Black -> Deep Red -> Neon Red -> Deep Red -> Black */
          background: linear-gradient(
            45deg,
            #000000 0%,
            #400000 25%,
            #be0404ff 50%,
            #400000 75%,
            #000000 100%
          );

          /* Size doubled to ensure smooth flow */
          background-size: 200% auto;

          /* Linear matches the "flow" vibe better than ease */
          animation: gradient-xy 5s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1.5s step-end infinite;
        }

        @keyframes ping-slow {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
