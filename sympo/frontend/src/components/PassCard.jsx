import { useRef } from 'react';

const PassPosterCard = ({ pass, selected, disabled = false, onToggle }) => {
  const glareRef = useRef(null);

  const animateGlare = (x, y, enter = true) => {
    const el = glareRef.current;
    if (!el) return;

    if (enter) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%';
      el.style.transition = '1000ms ease';
      el.style.backgroundPosition = '100% 100%';
    } else {
      el.style.transition = '600ms ease';
      el.style.backgroundPosition = '-100% -100%';
    }
  };

  return (
    <div
      onClick={!disabled ? onToggle : undefined}
      onMouseEnter={() => animateGlare(0, 0, true)}
      onMouseLeave={() => animateGlare(0, 0, false)}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
        disabled
          ? 'cursor-not-allowed opacity-40 grayscale'
          : 'cursor-pointer opacity-80 hover:opacity-100'
      } ${selected ? 'scale-[1.02] ring-2 ring-primary' : ''} `}
    >
      {/* IMAGE WRAPPER — controls aspect ratio */}
      <div className="relative aspect-[12/18] w-full bg-black">
        <img
          src={pass.image}
          alt={pass.title}
          className="h-full w-full object-cover object-center"
        />
        {/* GLARE OVERLAY */}
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(-45deg,
              hsla(0,0%,0%,0) 60%,
              rgba(238, 14, 14, 0.4) 70%,
              hsla(0,0%,0%,0) 100%)`,
            backgroundSize: '250% 250%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-100% -100%',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* OWNED BADGE */}
      {disabled && (
        <span className="absolute right-3 top-3 rounded-full border border-primary bg-black/70 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
          Owned
        </span>
      )}

      {/* BOTTOM STRIP */}
      <div className="absolute bottom-0 left-0 flex w-full items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-md">
        {/* LEFT */}
        <div>
          <p className="text-sm uppercase tracking-widest text-white">{pass.title}</p>
          <p className="text-sm text-primary">Rs. {pass.price}</p>
        </div>

        {/* TOGGLE */}
        <div
          className={`flex h-6 w-11 items-center rounded-full px-1 transition-all duration-300 ${
            selected
              ? 'justify-end bg-primary'
              : disabled
                ? 'justify-start bg-white/20'
                : 'justify-start bg-white/30'
          } `}
        >
          <div className="h-4 w-4 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
};

export default PassPosterCard;
