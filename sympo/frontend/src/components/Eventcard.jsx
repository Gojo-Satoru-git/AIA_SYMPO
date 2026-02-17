import { useState, useRef, useEffect } from 'react';
import { useSeatAval } from '../context/SeatAvalProvider';
import useToast from '../context/useToast';

function Eventcard({
  card,
  index,
  onClick, // This is handleInteraction from Events.jsx
  fallbackImage,
  isInCart,
  addToCart,
  category,
  isPurchased,
}) {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [Flipped, setFlipped] = useState(true);
  const cardRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { checkSeatAval } = useSeatAval();

  const stock = card.id >= 10 && checkSeatAval(card);

  // --- Original Button Logic ---
  let buttonText = stock ? 'Add' : 'Sold Out';
  let buttonClass = 'bg-primary text-black hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]';
  let isDisabled = !stock;

  if (isPurchased) {
    buttonText = 'Sold';
    buttonClass = 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700';
    isDisabled = true;
  } else if (isInCart) {
    buttonText = 'Added';
    buttonClass =
      'bg-orange-500/10 text-orange-500 border border-orange-500/50 animate-pulse cursor-not-allowed';
    isDisabled = true;
  }

  // --- Appearance & Flip Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setHasAppeared(true);
        else {
          setHasAppeared(false);
          setFlipped(true);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasAppeared) {
      const timer = setTimeout(() => setFlipped(false), index * 150);
      return () => clearTimeout(timer);
    }
  }, [hasAppeared, index]);

  return (
    <div ref={cardRef} className="perspective m-2 h-[420px] w-[280px] flex-shrink-0 sm:m-1">
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-1000 ${
          Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
        }`}
      >
        {/* FRONT FACE */}
        <div
          onClick={(e) => onClick(e)} // Triggers the Lightning Strike in Events.jsx
          className="backface-hidden relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-md border-2 border-primary bg-black shadow-stGlow transition-all hover:border-red-500"
        >
          {/* IMAGE SECTION */}
          <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-primary/20 bg-black">
            <img
              src={card.image || fallbackImage}
              alt={card.title}
              onLoad={() => setImgLoaded(true)}
              className={`h-full w-full object-contain transition-opacity duration-700 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {imgLoaded && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)',
                }}
              />
            )}
          </div>

          {/* DATA SECTION */}
          <div className="flex flex-1 flex-col justify-between bg-black p-4">
            <div className="text-center">
              {/* Restored Rolling Events Logic */}
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-80">
                {card.id < 10 ? `Rolling Event starts ${card.time}` : `${card.date} • ${card.time}`}
              </p>
            </div>

            <div className="mt-4 flex w-full gap-2">
              {/* INFO BUTTON: Does not trigger lightning, just opens details */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(e);
                }}
                className="flex-1 rounded-sm border border-white/20 py-2.5 text-[10px] font-black uppercase text-white transition-colors hover:bg-white/5"
              >
                Info
              </button>

              {/* ADD BUTTON: Does not trigger lightning, handles cart logic */}
              {card.id >= 10 && (
                <button
                  disabled={isDisabled}
                  className={`relative flex-1 overflow-hidden rounded-sm py-2.5 text-[10px] font-black uppercase transition-all ${buttonClass} ${stock ? '' : 'cursor-not-allowed opacity-50 '}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents lightning strike on button click
                    if (isPurchased || isInCart || !stock) return;

                    // Only if it passes the guards, add to cart
                    addToCart(card, category);
                  }}
                >
                  <span className="relative z-10">{buttonText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="backface-hidden absolute inset-0 flex h-full w-full items-center justify-center rounded-md border-2 border-primary bg-black [transform:rotateY(180deg)]">
          <img src={card.backside} alt="Back" className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
