const Toast = ({ message, type }) => {
  const base =
    "fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border tracking-widest uppercase text-xs animate-toast";

  const variants = {
    success:
      "bg-black/90 border-red-600 text-red-500 shadow-red-500/40",
    error:
      "bg-black/90 border-red-700 text-red-400 shadow-red-600/40",
    info:
      "bg-black/90 border-white/30 text-white shadow-white/20",
  };

  return (
    <div className={`${base} ${variants[type] || variants.info}`}>
      {message}
    </div>
  );
};

export default Toast;
