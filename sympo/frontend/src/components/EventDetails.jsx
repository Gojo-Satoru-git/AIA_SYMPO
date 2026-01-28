import useToast from '../context/useToast';
import TeamForm from './teamForm';
import { useEffect, useRef, useState } from 'react';

function EventDetails({ card, onClose, AddtoCart, checkPurchase, checkCart }) {
  const { showToast } = useToast();
  const [showArrow, SetshowArrow] = useState(false);

  const [showForm, SetshowForm] = useState(false);

  const scrollRef = useRef(null);
  const checkoverflow = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollable = scrollHeight > clientHeight;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;
      SetshowArrow(isScrollable && !isBottom);
    }
  };
  useEffect(() => {
    const el = scrollRef.current;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkoverflow();
    window.addEventListener('resize', checkoverflow);
    if (el) {
      el.addEventListener('scroll', checkoverflow);
    }
    return () => {
      window.removeEventListener('resize', checkoverflow);
      if (el) el.removeEventListener('scroll', checkoverflow);
    };
  }, [card]);
  return (
    <>
      {showForm ? (
        <TeamForm
          teamSize={card.teamSize}
          onclose={() => {
            SetshowForm(false);
          }}
        />
      ) : (
        <>
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-primary text-xl font-bold"
          >
            ✕
          </button>

          <div
            ref={scrollRef}
            className="flex items-center flex-col gap-4 p-8 md:border border-primary md:shadow-stGlow rounded-md max-h-[90vh] max-w-3xl mx-auto mt-10 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-72 aspect-[4/5] object-cover  rounded-md shadow-stGlow"
            />
            <p className="text-primary text-lg text-center ">{card.description}</p>
            <div className="w-full bg-black/40 border border-primary/30 rounded-lg p-2 flex flex-wrap justify-around items-center gap-6 text-primary text-lg">
              {/* Team Size */}
              <div className="text-center">
                <span className="block font-bold uppercase text-sm opacity-70">Team Size</span>
                <span className="text-xl">{card.teamSize}</span>
              </div>

              {/* Date & Time */}
              <div className="text-center">
                <span className="block font-bold uppercase text-sm opacity-70">Date & Time</span>
                <span className="text-xl">
                  {card.date} | {card.time}
                </span>
              </div>

              {/* Contacts Group */}
              <div className="flex flex-col items-center sm:border-l border-primary/30 sm:pl-6">
                <span className="font-bold uppercase text-sm opacity-70 mb-2">Contacts</span>

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
              <button
                className={`${checkPurchase(card) || checkCart(card) ? 'opacity-35' : ''} bg-primary text-black rounded-full px-4 py-2 shadow-stGlow `}
                onClick={() => {
                  if (checkPurchase(card)) {
                    showToast(`${card.title} already in your purchase`, 'info');
                  } else if (!checkCart(card)) {
                    AddtoCart(card, card.category ? 'event' : 'workshop');
                    showToast(`${card.title} added check the registration`, 'success');
                  } else {
                    showToast(`${card.title} is already in your cart`, 'info');
                  }
                }}
              >
                Add
              </button>
              <button
                className={` bg-primary text-black rounded-full px-4 py-2 shadow-stGlow `}
                onClick={() => {
                  SetshowForm(true);
                }}
              >
                Add team details
              </button>
            </div>
            <p className="text-primary text-lg italic">Rules : {card.rules}</p>
            {showArrow && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-red-600 text-xl animate-bounce drop-shadow-md bg-black/50 rounded-full px-2">
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
