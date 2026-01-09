import React, { useState, useEffect } from "react";

const dateText = "FEBRUARY   21 ,   2026   ·   MIT ,   CHENNAI";

const Home = () => {
  const [showLine, setShowLine] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLine(true);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (showLine) {
      const timer = setTimeout(() => {
        setStartTyping(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showLine]);


  useEffect(() => {
    if (startTyping && charIndex < dateText.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + dateText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 90);

      return () => clearTimeout(timer);
    }
  }, [startTyping, charIndex]);

  return (
    <section className="flex justify-center items-center bg-black min-h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center">

     
        <p className="font-strange mb-6 text-2xl tracking-[0.4em] text-white opacity-80 min-h-[2rem]">
          {typedText}
          {startTyping && charIndex < dateText.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>
          
        <h1
          className="relative text-6xl md:text-8xl font-bold uppercase text-red-600 tracking-wider
                     after:content-[attr(data-text)] after:absolute after:top-0 after:left-0
                     after:text-red-600 after:blur-lg
                     animate-zoom animate-flicker"
          data-text="Symposium"
        >
          Symposium
        </h1>

        <div
          className="h-1  bg-red-600 mt-4 transition-all duration-1000"
          style={{
            width: showLine ? "100%" : "0%",
            transitionDelay: "0.5s",
            boxShadow: showLine
              ? "0 0 10px rgba(229,9,20,0.8), 0 0 20px rgba(229,9,20,0.6)"
              : "none",
          }}
        />

      </div>
    </section>
  );
};

export default Home;
