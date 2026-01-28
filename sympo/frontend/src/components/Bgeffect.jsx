import React, { useMemo } from 'react';

const BackgroundEffect = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="absolute inset-0  pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-gray-950 to-red-950" />

      {/* Blue smoke */}
      <div
        className="absolute left-0 top-0 h-full w-1/2 blur-3xl animate-pulse opacity-60"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(30,58,138,0.45), transparent 70%)',
        }}
      />
      {/* Red smoke */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 blur-3xl animate-pulse opacity-70"
        style={{
          background: 'radial-gradient(circle at 70% 50%, rgba(185,28,28,0.45), transparent 70%)',
          animationDelay: '1.5s',
        }}
      />
      {/* Particles */}
      {particles.map((p) => {
        const isBlueSide = p.x < 50;
        return (
          <div
            key={p.id}
            className={`absolute w-1 h-1 rounded-full ${
              isBlueSide
                ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]'
                : 'bg-red-500 shadow-[0_0_12px_red]'
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        );
      })}

      {/* Vignette */}
    
    </div>
  );
};

export default BackgroundEffect;
