import React, { useState, useEffect } from "react";


const dateText = "FEBRUARY   21 ,   2026   ·   MIT ,   CHENNAI";

const Home = () => {
  const [showLine, setShowLine] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showLogos, setShowLogos] = useState(false);


  
  useEffect(() => {
    const timer = setTimeout(() => setShowLine(true), 2000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (showLine) {
      const timer = setTimeout(() => setStartTyping(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [showLine]);

 
  useEffect(() => {
    if (startTyping && charIndex < dateText.length) {
      const timer = setTimeout(() => {
        setTypedText(prev => prev + dateText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [startTyping, charIndex]);

 
  useEffect(() => {
    if (charIndex === dateText.length) {
      const timer = setTimeout(() => setShowLogos(true), 500);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return (
    <section className="relative flex flex-col justify-center items-center bg-black min-h-screen overflow-hidden px-4 sm:px-6 md:px-10">

    
      <div
        className={`hidden md:flex absolute top-8 left-6 flex items-center gap-3 z-40
          transition-all duration-1000 ease-out
          ${showLogos ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
      >
        <img
          src="/AU.png"
          alt="AIA Logo"
          className="h-10 sm:h-12 md:h-16 object-contain"
        />
        <span className="text-white font-bold tracking-[0.3em] ml-2 text-sm sm:text-base md:text-xl lg:text-3xl uppercase">
          AIA
        </span>
     </div>
      

    <div
  className={`absolute z-40 transition-all duration-1000 ease-out
    top-[130px] md:top-[130px]
    left-1/2 transform -translate-x-1/2
    md:left-auto md:right-8 md:translate-x-0
    ${showLogos ? "opacity-100 scale-100" : "opacity-0 scale-90"}
    w-full max-w-lg
  `}
>
  <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap md:justify-end">
    
    <img
      src="/AU.png"
      alt="Logo 1"
      className="h-16 sm:h-14 md:h-20 lg:h-30 object-contain"
    />
    
    <img
      src="/MIT.png"
      alt="Logo 2"
      className="h-16 sm:h-16 md:h-20 object-contain"
    />
 
    <img
      src="/76.png"
      alt="Logo 3"
      className="h-16 sm:h-16 md:h-20 object-contain"
    />
  
    <img
      src="/MIT.png"
      alt="Logo 4"
      className="h-16 sm:h-16 md:h-20 object-contain w-full md:w-auto"
    />
  </div>
</div>


     
      <div className="mt-[10px] md:mt-5 flex flex-col items-center justify-center text-center w-full max-w-5xl">

   
        <p className="font-strange mb-6 lg:mt-5 text-xs sm:text-sm md:text-xl tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.4em] text-white opacity-80 min-h-[1.5rem] sm:min-h-[2rem] break-words">
          {typedText}
          {startTyping && charIndex < dateText.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>

 
        <div className="inline-block">
          <h1
            className="relative text-4xl sm:mt-5 sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[0.3em] sm:tracking-widest animate-zoom animate-flicker"
            style={{
              background: "linear-gradient(180deg, #ff6b6b 0%, #e50914 40%, #7a0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `
                0 0 6px rgba(0,3,0,0.9),
                0 0 12px rgba(120,9,20,0.7),
                0 0 20px rgba(220,9,20,0.5)
              `,
              WebkitTextStroke: "2px red",
            }}
          >
            Symposium
          </h1>

      
          <div
            className={`h-[3px] sm:h-1 bg-red-600 mt-4 origin-center transition-transform duration-1000
              ${showLine ? "scale-x-100 delay-500 shadow-[0_0_10px_rgba(229,9,20,0.8),0_0_20px_rgba(229,9,20,0.6)]" : "scale-x-0"}
            `}
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
