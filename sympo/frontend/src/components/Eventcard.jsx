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

  const { isEventCoveredByPass } = useCart();
  let buttonText = 'Add';
  let buttonClass = 'bg-primary text-black';
  let isDisabled = false;
  const { checkCart } = useCart();

  if (isPurchased) {
    buttonText = 'Purchased';
    buttonClass = 'bg-black-600 text-white cursor-not-allowed';
    isDisabled = true;
  } else if (isInCart) {
    buttonText = 'In Cart';
    buttonClass = 'bg-orange-500 text-black cursor-not-allowed';
    isDisabled = true;
  }
  useEffect(() => {
    setHasAppeared(false);
    setFlipped(true);
  }, [category, card.title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Use the first entry (index 0)
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
  const sizeClasses = 'w-full max-w-[320px] aspect-[2/3]';
  return (
    <div ref={cardRef} className={`perspective flex-shrink-0 ${sizeClasses} m-2 sm:m-1`}>
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-1000 ${
          Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
        }`}
      >
        {/* FRONT FACE (Needs backface-hidden to swap correctly) */}
        <div
          onClick={onClick}
          className="backface-hidden relative inset-0 flex h-full w-full cursor-pointer flex-col items-center rounded-md border-4 border-primary bg-black shadow-stGlow"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-primary/30 bg-zinc-900">
            <img
              src={card.image || fallbackImage}
              alt={`AIA SYMPO TEKHORA26 ${card.title.toUpperCase()}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                if (!fallbackImage) return;
                e.currentTarget.src = fallbackImage;
                e.currentTarget.onerror = null;
              }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-500 opacity-80">
                {card.id < 10 ? 'Rolling Event starts 9:30' : `${card.date} • ${card.time}`}
              </p>
            </div>

            <div
              className={`mt-auto flex items-center gap-3 ${card.id < 10 ? 'justify-center' : 'justify-between'}`}
            >
              <button
                onClick={onClick}
                className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 transition-colors hover:text-white"
              >
                Learn More
              </button>

              {card.id >= 10 && (
                <button
                  disabled={isDisabled}
                  className={`flex-1 rounded py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${buttonClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEventCoveredByPass(card.id)) {
                      showToast('Already included in the pass');
                      return;
                    }

                    if (!checkCart(card)) {
                      addToCart(card, category);
                    }
                  }}
                >
                  {buttonText}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE (Pre-rotated to face away) */}
        <div className="backface-hidden absolute inset-0 flex h-full w-full items-center justify-center rounded-md bg-primary [transform:rotateY(180deg)]">
          <img src={card.backside} className="m-4 h-full w-full overflow-hidden"></img>
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
