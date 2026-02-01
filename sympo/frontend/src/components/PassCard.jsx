const PassPosterCard = ({ pass, selected, disabled = false, onToggle }) => {
  return (
    <div
      onClick={!disabled ? onToggle : undefined}
      className={`
        relative
        rounded-2xl
        overflow-hidden
        transition-all duration-300

        ${disabled
          ? 'opacity-40 grayscale cursor-not-allowed'
          : 'cursor-pointer opacity-80 hover:opacity-100'}

        ${selected ? 'ring-2 ring-primary scale-[1.02]' : ''}
      `}
    >
      {/* IMAGE */}
      <img
        src={pass.image}
        alt={pass.title}
        className="w-full h-[420px] object-cover"
      />

      {/* OWNED BADGE */}
      {disabled && (
        <span
          className="
            absolute top-3 right-3
            bg-black/70 backdrop-blur
            border border-primary
            text-primary
            text-xs
            px-3 py-1
            rounded-full
            uppercase tracking-widest
          "
        >
          Owned
        </span>
      )}

      {/* BOTTOM STRIP */}
      <div
        className="
          absolute bottom-0 left-0 w-full
          bg-black/80 backdrop-blur-md
          px-4 py-3
          flex items-center justify-between
        "
      >
        {/* LEFT */}
        <div>
          <p className="uppercase tracking-widest text-sm text-white">
            {pass.title}
          </p>
          <p className="text-primary text-sm">Rs. {pass.price}</p>
        </div>

        {/* TOGGLE (VISUAL ONLY WHEN DISABLED) */}
        <div
          className={`
            w-11 h-6 rounded-full
            flex items-center px-1
            transition-all duration-300
            ${
              selected
                ? 'bg-primary justify-end'
                : disabled
                ? 'bg-white/20 justify-start'
                : 'bg-white/30 justify-start'
            }
          `}
        >
          <div className="w-4 h-4 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PassPosterCard;
