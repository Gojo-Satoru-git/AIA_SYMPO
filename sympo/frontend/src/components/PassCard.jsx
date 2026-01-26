const PassPosterCard = ({ pass, selected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`
        relative
        cursor-pointer
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        ${selected ? 'ring-2 ring-primary scale-[1.02]' : 'opacity-80 hover:opacity-100'}
      `}
    >
      {/* IMAGE */}
      <img src={pass.image} alt={pass.title} className="w-full h-[420px] object-cover" />

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
          <p className="uppercase tracking-widest text-sm text-white">{pass.title}</p>
          <p className="text-primary text-sm">Rs. {pass.price}</p>
        </div>

        {/* TOGGLE */}
        <div
          className={`
            w-11 h-6 rounded-full
            flex items-center px-1
            transition-all duration-300
            ${selected ? 'bg-primary justify-end' : 'bg-white/30 justify-start'}
          `}
        >
          <div className="w-4 h-4 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PassPosterCard;
