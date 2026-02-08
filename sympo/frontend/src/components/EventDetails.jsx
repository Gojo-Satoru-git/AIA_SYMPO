import useToast from '../context/useToast';
import TeamForm from './teamForm';
import useCart from '../context/useCart';
import { useEffect, useRef, useState, useCallback } from 'react';

function EventDetails({ card, onClose, checkPurchase, addToCart }) {
  const { showToast } = useToast();
  const { checkCart } = useCart();
  const [showArrow, SetshowArrow] = useState(false);
  const [showAdd, setShowAdd] = useState(card.id === '16' || card.id === '17' || card.id === '18');
  const { isEventCoveredByPass } = useCart();

  const [showForm, SetshowForm] = useState(false);

  const isPurchased = checkPurchase(card);
  const isInCart = checkCart(card);

  let buttonText = 'Add';
  let buttonClass = 'bg-primary text-black';
  let isDisabled = false;

  if (isPurchased) {
    buttonText = 'Purchased';
    buttonClass = 'bg-black-600 text-white cursor-not-allowed';
    isDisabled = true;
  } else if (isInCart) {
    buttonText = 'In Cart';
    buttonClass = 'bg-orange-500 text-black cursor-not-allowed';
    isDisabled = true;
  }

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const checkoverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use requestAnimationFrame to sync with browser paint cycles
    window.requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollable = scrollHeight > clientHeight;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;

      // 2. Only update state if the value actually changes to prevent over-rendering
      SetshowArrow((prev) => {
        const newValue = isScrollable && !isBottom;
        return prev !== newValue ? newValue : prev;
      });
    });
  }, []);
  useEffect(() => {
    // 1. Check if the content is actually long enough to scroll
    const checkInitialScroll = () => {
      if (scrollRef.current) {
        SetshowArrow(scrollRef.current.scrollHeight > scrollRef.current.clientHeight);
      }
    };

    // 2. Observer to detect when user reaches the bottom
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the bottom sentinel is visible, hide arrow
        SetshowArrow(!entry.isIntersecting);
      },
      { root: scrollRef.current, threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    checkInitialScroll();

    return () => observer.disconnect();
  }, [card]);
  return (
    <>
      {showForm && (card.id === '17' || card.id === '16' || card.id === '18') ? (
        <TeamForm
          title={card.title}
          teamSize={card.teamSize}
          mini={card.miniTeamSize}
          setShowAdd={setShowAdd}
          onclose={() => {
            SetshowForm(false);
          }}
          isDisabledAll={isPurchased}
        />
      ) : (
        <>
          <button
            onClick={onClose}
            className="absolute right-4 top-2 text-xl font-bold text-primary"
          >
            ✕
          </button>
          <div className="relative mx-auto mt-10 max-w-3xl">
            <div
              ref={scrollRef}
              className="isolation-auto mx-auto mt-10 flex max-h-[90vh] max-w-3xl transform-gpu flex-col items-center gap-4 overflow-auto rounded-md border-primary bg-black/70 p-8 will-change-scroll [-ms-overflow-style:none] [scrollbar-width:none] md:border md:shadow-stGlow [&::-webkit-scrollbar]:hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img
                src={card.image}
                alt={`AIA SYMPO TEKHORA26 ${card.title.toUpperCase()}`}
                className="aspect-[4/5] w-72 rounded-md object-cover shadow-stGlow"
              />
              <div className="w-full max-w-2xl px-4">
                <p className="whitespace-pre-line text-center text-lg leading-relaxed tracking-wide text-gray-300">
                  {card.description}
                </p>
              </div>
              <div className="flex w-full flex-wrap items-center justify-around gap-6 rounded-lg border border-primary/30 bg-black/40 p-2 text-lg text-primary">
                {/* Team Size */}
                <div className="text-center">
                  <span className="block text-sm font-bold uppercase opacity-70">Team Size</span>
                  {card.miniTeamSize && <span className="text-xl">{card.miniTeamSize}-</span>}
                  <span className="text-xl">{card.teamSize}</span>
                </div>

                {/* Date & Time */}
                <div className="text-center">
                  <span className="block text-sm font-bold uppercase opacity-70">Date & Time</span>
                  <span className="text-xl">
                    {card.date} | {card.time}
                  </span>
                </div>

                {/* Contacts Group */}
                <div className="items-ctenter flex flex-col border-primary/30 sm:border-l sm:pl-6">
                  <span className="mb-2 text-sm font-bold uppercase opacity-70">Contacts</span>

                  <div className="flex gap-6 text-center">
                    {/* Contact 1 */}
                    <div>
                      <div className="font-bold text-white">{card.contact.name1}</div>
                      <div className="text-sm">{card.contact.phone1}</div>
                    </div>

                    {/* Contact 2 */}
                    {card.contact.name2 && (
                      <div>
                        <div className="font-bold text-white">{card.contact.name2}</div>
                        <div className="text-sm">{card.contact.phone2}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {card.id >= 10 && (
                  <button
                    disabled={isDisabled}
                    className={`${isDisabled ? 'opacity-35' : ''} ${buttonClass} rounded-full px-4 py-2 shadow-stGlow`}
                    onClick={() => {
                      console.log(isEventCoveredByPass(card.id));
                      if (isEventCoveredByPass(card.id)) {
                        showToast('Already included in the pass');
                        return;
                      } else if (
                        (card.id === '16' || card.id === '17' || card.id == '18') &&
                        localStorage.getItem(`${card.title}-teamData`) === null
                      ) {
                        showToast('Please add team details first', 'info');
                      } else if (!checkCart(card)) {
                        addToCart(card, card.category);
                        showToast(`${card.title} added check the registration`, 'success');
                      } else {
                        showToast(`${card.title} is already in your cart`, 'info');
                      }
                    }}
                  >
                    {buttonText}
                  </button>
                )}
                {card.id === '16' || card.id === '17' || card.id == '18' ? (
                  <button
                    className={`rounded-full bg-primary px-4 py-2 text-black shadow-stGlow ${!showAdd || checkCart(card) || checkPurchase(card) ? 'opacity-35' : ''}`}
                    onClick={() => {
                      SetshowForm(true);
                    }}
                  >
                    {isPurchased ? 'View Team' : 'Add Team Details'}
                  </button>
                ) : null}
              </div>
              <div>
                <p className="mb-2 text-lg italic text-primary">Rules:</p>

                <ul className="list-inside list-disc text-base text-gray-400">
                  {card.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
                <div ref={bottomRef} className="h-1 w-full" />
              </div>
            </div>
            {showArrow && (
              <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="animate-bounce rounded-full bg-black/50 px-2 text-xl text-red-600 drop-shadow-md">
                  ↓
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default EventDetails;
