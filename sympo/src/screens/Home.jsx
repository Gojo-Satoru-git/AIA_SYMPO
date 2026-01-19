import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const dateText = "FEBRUARY   21 ,   2026   ·   MIT ,   CHENNAI";

const Home = () => {
  const [showLine, setShowLine] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showLogos, setShowLogos] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const navigate =  useNavigate();

  
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

  useEffect(() => {
  if (charIndex === dateText.length) {
    const timer = setTimeout(() => {
      setShowLogos(true);
      setShowDescription(true); // 👈 added
    }, 500);
    return () => clearTimeout(timer);
  }
}, [charIndex]);


  return (
    <section className="relative flex flex-col justify-center items-center  min-h-screen overflow-hidden px-4 sm:px-6 md:px-10">
      <div
        className={`hidden lg:flex absolute top-8 left-6 flex items-center gap-3 z-40
          transition-all duration-1000 ease-out
          ${showLogos ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
      >
        <img
          src="/AIA.png"
          alt="AIA Logo"
          className="h-10 sm:h-12 md:h-16 object-contain"
        />
        <span className="text-white font-bold tracking-[0.3em] ml-2 text-sm sm:text-base md:text-xl lg:text-3xl uppercase">
          AIA
        </span>
     </div>
      

 <div
  className={`absolute z-40 transition-all duration-1000 ease-out
    top-[70px] sm:top-[120px] md:top-[110px]
    left-1/2 transform -translate-x-1/2
    md:left-auto md:right-8 md:translate-x-0
    ${showLogos ? "opacity-100 scale-100" : "opacity-0 scale-90"}
    w-full max-w-lg
    px-4
  `}
>

<div
  className="flex flex-wrap justify-center gap-2
             scale-[0.8] sm:scale-100
             md:flex-nowrap md:justify-end"
>

    
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
      src="/AIA.png"
      alt="Logo 4"
      className="h-16 sm:h-16 md:h-20 object-contain w-full md:w-auto"
    />
  </div>
</div>


     
      <div className="mt-[44px] md:mt-16 sm:mt-12  lg:mt-24 flex flex-col items-center justify-center text-center w-full max-w-5xl">

   
        <p className="font-strange mb-2 sm:mt-24 md:mt-28 lg:mt-32 text-xs sm:text-lg md:text-xl tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.4em] text-white opacity-80 min-h-[1.5rem] sm:min-h-[2rem] break-words">
          {typedText}
          {startTyping && charIndex < dateText.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>

 
        <div className="inline-block">
          <h1
            className="relative text-4xl sm:mt-5 lg:mt-0 sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[0.3em] sm:tracking-widest animate-zoom "
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
              <p
        className={`
          mt-6 text-center text-white/80
          text-sm sm:text-base md:text-lg lg:text-2xl
          max-w-3xl transition-all duration-1000 ease-out
          ${showDescription ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
      >
        Intercollegiate tech symposium, hosted by MIT's Department of Artificial Intelligence and Data Science.
      </p>

      {/* Month */}
<p
  className={`
    mt-8 text-center text-red-600
    text-xs sm:text-2xl md:text-base lg:text-4xl
    tracking-[0.3em] uppercase
    transition-all duration-1000 ease-out delay-150
    ${showDescription ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
  `}
>
  February
</p>

{/* Dates */}
<p
  className={`
    mt-1 text-center text-white 
    text-sm sm:text-2xl md:text-lg lg:text-4xl font-semibold
    tracking-widest
    transition-all duration-1000 ease-out delay-300
    ${showDescription ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
  `}
>
  21 &amp; 22
</p>
<div className="h-6 sm:h-10" />
<div 
  onClick={() => {
    document.getElementById("Events")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className={`
    sm:mt-6 lg:mt-0
    cursor-pointer select-none
    transition-all duration-700 ease-out
    ${showDescription ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
  `}
>
  <div
    className="
      flex items-center gap-4
      px-3 py-2 sm:px-6 sm:py-4

      border-2 border-red-600
      rounded-xl
      shadow-[0_0_16px_rgba(229,9,20,0.8)]
      hover:shadow-[0_0_28px_rgba(229,9,20,1)]
      transition-all duration-300
      animate-pulse
    "
  >

    <span className="text-red-600 text-2xl animate-bounce">↓</span>

  
    <span
      className="
       text-red-600
    uppercase
    tracking-[0.10em] sm:tracking-[0.35em] 
    text-[10px] sm:text-sm md:text-base lg:text-lg
    font-semibold
    hover:text-white transition-colors duration-300
    text-center
      "
    >
      Enter the HellFire
    </span>
  </div>
</div>


      </div>
    </section>
  );
};

export default Home;
