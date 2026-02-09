import { useState, useRef, useEffect } from 'react';
import useToast from '../context/useToast';
import useCart from '../context/useCart';

function Eventcard({
  card,
  index,
  onClick,
  fallbackImage,
  isInCart,
  addToCart,
  category,
  isPurchased,
}) {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [Flipped, setFlipped] = useState(true);
  const cardRef = useRef(null);
  const { showToast } = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);

  const { isEventCoveredByPass, checkCart } = useCart();

  // Button State Logic
  let buttonText = 'Add';
  let buttonClass = 'bg-primary text-black hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]';
  let isDisabled = false;

  if (isPurchased) {
    buttonText = 'Sold';
    buttonClass = 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700';
    isDisabled = true;
  } else if (isInCart) {
    buttonText = 'In Cart';
    buttonClass =
      'bg-orange-500/10 text-orange-500 border border-orange-500/50 animate-pulse cursor-not-allowed';
    isDisabled = true;
  }

  useEffect(() => {
    setHasAppeared(false);
    setFlipped(true);
  }, [category, card.title]);

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
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasAppeared) {
      const delay = index * 200;
      const timer = setTimeout(() => setFlipped(false), delay);
      return () => clearTimeout(timer);
    }
  }, [hasAppeared, index]);

  const sizeClasses = 'w-full max-w-[280px] aspect-[2/3]';

  return (
    <div ref={cardRef} className={`perspective flex-shrink-0 ${sizeClasses} m-2 sm:m-1`}>
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-1000 ${Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}
      >
        {/* FRONT FACE */}
        <div
          onClick={onClick}
          className="backface-hidden relative inset-0 flex h-full w-full cursor-pointer flex-col items-center rounded-md border-4 border-primary bg-black shadow-stGlow"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-primary/30 bg-zinc-900">
            <img
              src={card.image || fallbackImage}
              alt={`AIA SYMPO TEKHORA26 ${card.title.toUpperCase()}`}
              onLoad={() => setImgLoaded(true)}
              className={`h-full w-full object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => {
                if (!fallbackImage) return;
                e.currentTarget.src = fallbackImage;
                e.currentTarget.onerror = null;
                setImgLoaded(true);
              }}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-1 flex-col justify-between p-3">
            <div className="text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-80">
                {card.id < 10 ? `Rolling Event starts ${card.time}` : `${card.date} • ${card.time}`}
              </p>
            </div>

            {/* SHARED BUTTON SPACE */}
            <div className="mt-auto flex w-full gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="flex-1 rounded-sm border border-white/10 py-1.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary/20"
              >
                Learn More
              </button>

              {card.id >= 10 && (
                <button
                  disabled={isDisabled}
                  className={`relative flex-1 overflow-hidden rounded-sm py-1.5 text-[9px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${buttonClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEventCoveredByPass(card.id)) {
                      showToast('Included in Pass');
                      return;
                    }
                    if (!checkCart(card)) addToCart(card, category);
                  }}
                >
                  {!isDisabled && (
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  )}
                  <span className="relative z-10">{buttonText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="backface-hidden absolute inset-0 flex h-full w-full items-center justify-center rounded-md bg-primary [transform:rotateY(180deg)]">
          <img src={card.backside} alt="Card Back" className="m-4 h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
