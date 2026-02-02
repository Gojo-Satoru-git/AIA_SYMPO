/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Ghost } from 'lucide-react';

function Eventcard({
  title,
  desc,
  image,
  date,
  time,
  index,
  category,
  backside,
  onClick,
  fallbackImage,
}) {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [Flipped, setFlipped] = useState(true);
  const cardRef = useRef(null);

  // --- ANIMATION LOGIC (Kept exactly as requested) ---
  useEffect(() => {
    setHasAppeared(false);
    setFlipped(true);
  }, [category, title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAppeared(true);
        } else {
          setHasAppeared(false);
          setFlipped(true);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasAppeared) {
      const delay = index * 200;
      const timer = setTimeout(() => {
        setFlipped(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [hasAppeared, index]);

  // --- STYLING ---
  const sizeClasses = 'w-[75vw] sm:w-72 lg:w-75 aspect-[3/4]';

  return (
    <div ref={cardRef} className={`perspective flex-shrink-0 ${sizeClasses} m-2 sm:m-0 group`}>
      <div
        className={`
          relative w-full h-full transition-all duration-[800ms] cubic-bezier(0.175, 0.885, 0.32, 1.275) preserve-3d
          ${Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}
          ${/* Add a red glow shadow on hover */ ''}
          hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] shadow-2xl rounded-xl
        `}
      >
        {/* --- FRONT FACE --- */}
        <div
          onClick={onClick}
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 cursor-pointer"
        >
          {/* 1. Background Image */}
          <div className="absolute inset-0">
            <img
              src={image || fallbackImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={(e) => {
                if (!fallbackImage) return;
                e.currentTarget.src = fallbackImage;
                e.currentTarget.onerror = null;
              }}
            />

            {/* 1b. Darker Overlay on Hover (New) */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 z-10" />

            {/* Vignette & Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />
          </div>
          {/* 3. Text Content */}
          <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end h-full z-30 transition-transform duration-500 group-hover:-translate-y-1">
            {/* Category Badge */}
            <div className="self-start px-2 py-1 mb-2 text-[10px] font-mono font-bold tracking-widest text-black bg-red-600 rounded-sm uppercase shadow-[0_0_10px_rgba(220,38,38,0.6)]">
              {category || 'Event'}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-[StrangerThings] text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 group-hover:text-red-500 transition-colors duration-300">
              {title}
            </h3>

            {/* Metadata Divider */}
            <div className="h-[1px] w-full bg-red-600/50 mb-3 group-hover:bg-red-500 transition-colors duration-300" />

            {/* Date & Time with Lucide Icons */}
            <div className="flex justify-between items-center font-mono text-xs text-gray-300">
              <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                <Calendar size={14} className="text-red-500" />
                {date}
              </span>
              <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                <Clock size={14} className="text-red-500" />
                {time}
              </span>
            </div>
          </div>

          {/* Border Glow on Hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600 rounded-xl transition-all duration-300 pointer-events-none z-40" />
        </div>

        {/* --- BACK FACE (Card Back) --- */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#111] rounded-xl flex items-center justify-center [transform:rotateY(180deg)] border-2 border-white/5 shadow-inner overflow-hidden">
          {backside ? (
            <img src={backside} alt="Card Back" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative p-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
              {/* Decorative Rings */}
              <div className="absolute w-[90%] h-[90%] border border-red-900/30 rounded-lg" />
              <div className="absolute w-[80%] h-[80%] border border-red-900/20 rounded-lg" />

              {/* Logo/Icon */}
              <div className="w-24 h-24 rounded-full border-2 border-red-600/40 flex items-center justify-center mb-4 bg-black/50 backdrop-blur-sm shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <Ghost size={40} className="text-red-600/80" />
              </div>

              <p className="font-[StrangerThings] text-red-700 text-xl tracking-widest uppercase opacity-60 text-center">
                Hawkins
                <br />
                High
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
