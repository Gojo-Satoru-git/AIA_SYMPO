import { useState, useRef, useEffect } from 'react';

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
  const [imgLoaded, setImgLoaded] = useState(false);

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
        className={`preserve-3d relative h-full w-full transition-transform duration-1000 ${Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}
      >
        {/* FRONT FACE */}
        <div
          onClick={(e) => onClick(e)} // Passes click event to calculate X
          className="backface-hidden relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-md border-2 border-primary bg-black shadow-stGlow transition-all hover:brightness-125"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-primary/20 bg-black">
            <img
              src={card.image || fallbackImage}
              className={`h-full w-full object-contain transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <h3 className="truncate text-[14px] font-black uppercase text-white">{card.title}</h3>
            <p className="text-[10px] font-bold uppercase text-red-500">
              {card.date || 'Rolling Event'}
            </p>
          </div>
        </div>
        {/* BACK FACE */}
        <div className="backface-hidden absolute inset-0 flex h-full w-full items-center justify-center rounded-md border-2 border-primary bg-black [transform:rotateY(180deg)]">
          <img src={card.backside} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
