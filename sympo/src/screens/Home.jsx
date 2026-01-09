import React, { useState, useEffect } from "react";

const Home = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <section className="flex justify-center items-center bg-black min-h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        
        {/* TITLE */}
        <h1
          className="relative text-6xl md:text-8xl font-bold uppercase text-red-600 tracking-wider
                     after:content-[attr(data-text)] after:absolute after:top-0 after:left-0
                     after:text-red-600 after:blur-lg
                     animate-zoom animate-flicker"
          data-text="Symposium"
        >
          Symposium
        </h1>

        {/* LINE */}
        <div
          className="h-1 bg-red-600 mt-4 transition-all duration-1000"
          style={{
            width: isAnimated ? "100%" : "0%",
            transitionDelay: "1s",
            boxShadow: isAnimated
              ? "0 0 10px rgba(229,9,20,0.8), 0 0 20px rgba(229,9,20,0.6)"
              : "none",
          }}
        />
      </div>
    </section>
  );
};

export default Home;
