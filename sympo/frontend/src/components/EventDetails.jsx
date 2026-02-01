import useToast from '../context/useToast';
import TeamForm from './teamForm';
import useCart from '../context/useCart';
import { useEffect, useRef, useState } from 'react';

function EventDetails({ card, onClose, checkPurchase, addToCart, itemCategory }) {
  const { showToast } = useToast();
  const { checkCart } = useCart();
  const [showArrow, SetshowArrow] = useState(false);
  const [showAdd, setShowAdd] = useState(card.id === '12' || card.id === '13');
  const { isEventCoveredByPass } = useCart();

  const [showForm, SetshowForm] = useState(false);

  const isPurchased = checkPurchase(card);
  const isInCart = checkCart(card);

  let buttonText = "Add";
  let buttonClass = "bg-primary text-black";
  let isDisabled = false;

  if (isPurchased) {
    buttonText = "Purchased";
    buttonClass = "bg-black-600 text-white cursor-not-allowed";
    isDisabled = true;
  } else if (isInCart) {
    buttonText = "In Cart";
    buttonClass = "bg-orange-500 text-black cursor-not-allowed";
    isDisabled = true;
  }


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
      {showForm && (card.id === '12' || card.id === '13') ? (
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
                disabled={isDisabled}
                className={`${isDisabled ? 'opacity-35' : ''} ${buttonClass} rounded-full px-4 py-2 shadow-stGlow `}
                onClick={() => {
                  console.log(isEventCoveredByPass(card.id));
                  if (isEventCoveredByPass(card.id)) {
                    showToast('Already included in the pass');
                    return;
                  }
                  else if ((card.id === '12' || card.id === '13' ) && localStorage.getItem(`${card.title}-teamData`) === null) {

                    showToast('Please add team details first', 'info');
                  }
                  else if (!checkCart(card)) {
                    addToCart(card, card.category);
                    showToast(`${card.title} added check the registration`, 'success');
                  } else {
                    showToast(`${card.title} is already in your cart`, 'info');
                  }
                }}
              >
                {buttonText}
              </button>
              {card.id === '12' || card.id === '13' ? (
                <button
                  className={` bg-primary text-black rounded-full px-4 py-2 shadow-stGlow ${!showAdd || checkCart(card) || checkPurchase(card) ? 'opacity-35' : ''}`}
                  onClick={() => {
                    SetshowForm(true);
                  }}
                >
                  {isPurchased ? "View Team" : 'Add Team Details'}
                </button>
              ) : null}
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
