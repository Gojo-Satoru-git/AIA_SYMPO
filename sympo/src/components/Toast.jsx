const Toast = ({ message, type }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] animate-toastIn">
      <div
        className={`
          px-6 py-4 rounded-xl
          bg-darkCard border
          shadow-stGlow
          tracking-widest uppercase text-xs
          ${
            type === 'add'
              ? 'border-primary text-primary'
              : type === 'remove'
                ? 'border-white/40 text-white'
                : 'border-primary/40 text-primary'
          }
        `}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
