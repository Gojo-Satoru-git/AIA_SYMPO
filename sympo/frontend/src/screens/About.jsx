import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const About = () => {
  const containerRef = useRef(null);

  // 1. SCROLL SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 2. FIXED JITTER: useSpring creates a "physics" buffer.
  // High damping = like moving through water (no jitter).
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3. TRANSFORMATIONS (Smoothed)
  const yRange = useTransform(smoothProgress, [0, 1], [50, -50]);
  const opacityRange = useTransform(smoothProgress, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);
  const scaleRange = useTransform(smoothProgress, [0.1, 0.5], [0.95, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-transparent overflow-hidden"
    >
      {/* --- CONTENT --- */}
      <div className="max-w-4xl mx-auto text-center relative z-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="stranger-title text-5xl md:text-7xl tracking-widest uppercase text-transparent stroke-text drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            About the <br className="md:hidden" />
            {/* FIXED: White text with Flicker Animation */}
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] flicker-slow inline-block mt-2 md:mt-0">
              Symposium
            </span>
          </h2>

          <div className="h-[2px] w-24 bg-red-600 mx-auto mt-6 shadow-[0_0_10px_rgba(220,38,38,1)]" />
        </motion.div>

        {/* BODY TEXT */}
        <motion.div
          style={{
            opacity: opacityRange,
            scale: scaleRange,
            y: yRange,
          }}
          className="relative px-4"
        >
          <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-serif font-light text-justify md:text-center">
            {/* FIXED: Drop Cap Gap. removed float, used inline-block with tight margin */}
            <span className="stranger-title text-6xl text-red-600 inline-block align-middle mt-[-10px] mr-1 leading-none">
              T
            </span>
            <span className="font-semibold text-white">his is the beginning</span>. The inaugural
            edition of our technical symposium marks a new platform built to bring together
            curiosity, innovation, and collaboration.
          </p>

          <br />

          <p className="text-gray-400/90 text-lg md:text-xl leading-relaxed font-mono">
            Designed to encourage exploration beyond conventional boundaries, the symposium offers a
            space to learn, compete, and create through a diverse range of events. It is an
            invitation to push limits and be part of something that is just getting started.
          </p>
        </motion.div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=ITC+Benguiat&family=Courier+Prime:wght@400;700&display=swap');

        .stranger-title {
          font-family: 'ITC Benguiat', serif;
        }

        /* Hollow red text effect */
        .stroke-text {
          -webkit-text-stroke: 2px #c00;
          color: transparent;
        }

        /* Film Grain */
        .grain-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E");
        }

        /* The Flicker Animation (From your reference) */
        .flicker-slow {
          animation: flicker 3s linear infinite;
          -webkit-text-stroke: 0px; /* Ensure inner text is solid white */
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
            text-shadow:
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.4);
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

export default About;
