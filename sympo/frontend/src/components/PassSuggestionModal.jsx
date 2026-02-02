
const PassSuggestionModal = ({ open, suggestion, onClose, onAccept }) => {
  if (!open || !suggestion) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black border border-primary rounded-xl p-6 max-w-md w-full text-center relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-primary text-xl"
        >
          ✕
        </button>

        <h3 className="text-primary text-lg mb-3 uppercase tracking-widest">
          Better Offer Available
        </h3>

        <p className="text-white/70 text-sm mb-6 whitespace-pre-line">
          {suggestion.message}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded text-white"
          >
            Continue
          </button>

          <button
            onClick={onAccept}
            className="px-4 py-2 bg-primary text-black rounded font-semibold"
          >
            Buy {suggestion.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassSuggestionModal;
