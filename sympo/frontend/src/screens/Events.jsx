import { useState, useRef, useEffect, useContext } from 'react';
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
import LightningStrike from '../components/Lightning'; // Ensure path is correct
import { eventcontext } from '../context/event.context';
import { workshopcontext } from '../context/workshop.context';
import { usePurchases } from '../context/PurchaseContext';
import useCart from '../context/useCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import { Signeventscontext } from '../context/SEvents.context';

const Events = () => {
  // Refs for horizontal scrolling
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);

  // Core States
  const [Selected, SetSelected] = useState('All');
  const [clicked, setClicked] = useState(false);
  const [cardclicked, setCardclicked] = useState({ id: null, category: null });

  // Transition States
  const [isStriking, setIsStriking] = useState(false);
  const [strikeX, setStrikeX] = useState(0);

  // Context Hooks
  const { addToCart, checkCart } = useCart();
  const { checkPurchases } = usePurchases();
  const eventext = useContext(eventcontext);
  const Workshops = useContext(workshopcontext);
  const SEvents = useContext(Signeventscontext);

  // Navigation Arrow States
  const [showLeft, setshowLeft] = useState(false);
  const [showRight, setshowRight] = useState(true);
  const [showWLeft, setshowWLeft] = useState(false);
  const [showWRight, setshowWRight] = useState(true);
  const [showSELeft, setshowSELeft] = useState(false);
  const [showSERight, setshowSERight] = useState(true);

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = clicked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clicked]);

  // Handle the Lightning Strike + Detail Opening
  const handleCardInteraction = (e, item, category) => {
    // Calculate X position from -1.0 (left) to 1.0 (right) for the Shader
    const xPos = (e.clientX / window.innerWidth) * 2 - 1;
    setStrikeX(xPos);
    setIsStriking(true);

    // Open details modal after the initial bolt impact (400ms)
    setTimeout(() => {
      setCardclicked({ id: item.id, category: category });
      setClicked(true);
    }, 400);
  };

  const scroll = (directions, scrollRef) => {
    const { current } = scrollRef;
    if (current) {
      const firstCard = current.firstElementChild;
      const scrollSize = firstCard ? firstCard.clientWidth + 16 : 200;
      const scrollAmount = directions === 'left' ? -scrollSize : scrollSize;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScroll = (ref, setLeft, setRight) => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setLeft(scrollLeft > 20);
    setRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  const handleCart = (item, type) => {
    const price = Number(item.fees);
    addToCart({
      id: item.id,
      title: item.title,
      price: Number.isFinite(price) ? price : 0,
      type,
      isSignature: item.isSignature === true,
    });
  };

  // Find the detail object based on click state
  let detail = null;
  if (cardclicked.id !== null) {
    if (cardclicked.category === 'workshop') {
      detail = Workshops.find((w) => w.id === cardclicked.id);
    } else if (cardclicked.category === 'Signature Events') {
      detail = SEvents.find((e) => e.id === cardclicked.id);
    } else {
      detail = eventext.find((e) => e.id === cardclicked.id);
    }
  }

  const display =
    Selected === 'All' ? eventext : eventext.filter((event) => event.category === Selected);

  return (
    <>
      {/* 1. STYLES FOR SCREEN EFFECTS */}
      <style>{`
        @keyframes global-shake {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5px,-5px); }
          30% { transform: translate(5px,5px); }
          100% { transform: translate(0,0); }
        }
        .shake-active { animation: global-shake 0.2s ease-in-out; }
        .flash-active { filter: brightness(1.8) contrast(1.2); transition: filter 0.1s; }
      `}</style>

      {/* 2. GLOBAL LIGHTNING OVERLAY */}
      {isStriking && (
        <LightningStrike
          trigger={isStriking}
          xOffset={strikeX}
          hue={355}
          onComplete={() => setIsStriking(false)}
        />
      )}

      {/* 3. EVENT DETAILS MODAL */}
      {clicked && detail && (
        <div
          className="animate-in fade-in fixed left-0 top-0 z-[60] h-full w-full bg-black/70 backdrop-blur-md duration-500"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setClicked(false);
              setCardclicked({ id: null, category: null });
            }
          }}
        >
          <EventDetails
            card={detail}
            itemCategory={cardclicked.category}
            onClose={() => setClicked(false)}
            checkPurchase={checkPurchases}
            isInCart={checkCart(detail)}
            isPurchased={checkPurchases(detail)}
          />
        </div>
      )}

      {/* 4. MAIN PAGE CONTENT */}
      <div
        className={`flex min-h-screen flex-col p-10 transition-all duration-300 ${isStriking ? 'shake-active flash-active' : ''}`}
      >
        {/* Category Filter */}
        <div className="mt-10 flex items-center justify-center py-10 text-primary">
          <ul className="flex flex-shrink-0 gap-5 text-primary md:gap-8 lg:justify-center">
            {['All', 'Technical', 'Non-Technical'].map((cat) => (
              <li
                key={cat}
                className={`animated-border cursor-pointer rounded-full border-solid p-2 shadow-stGlow transition-transform ${Selected === cat ? 'scale-125 bg-primary text-black' : ''}`}
                onClick={() => SetSelected(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Regular Events Section */}
        <div className="max-w-8xl group relative flex w-full items-center">
          {showLeft && (
            <IconButton
              onClick={() => scroll('left', scrollRef2)}
              sx={scrollButtonStyle({ left: -24 })}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}
          <div
            ref={scrollRef2}
            onScroll={() => checkScroll(scrollRef2, setshowLeft, setshowRight)}
            className="no-scrollbar flex snap-x items-center justify-start gap-4 overflow-x-auto scroll-smooth px-4"
          >
            {display.map((event, index) => (
              <div key={event.id} className="flex-shrink-0 snap-center">
                <Eventcard
                  card={event}
                  index={index}
                  addToCart={handleCart}
                  onClick={(e) => handleCardInteraction(e, event, event.category)}
                  category={event.category}
                  isPurchased={checkPurchases(event)}
                  isInCart={checkCart(event)}
                />
              </div>
            ))}
          </div>
          {showRight && (
            <IconButton
              onClick={() => scroll('right', scrollRef2)}
              sx={scrollButtonStyle({ right: -24 })}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        {/* Signature Events Section */}
        <SectionHeader title="Signature Events" />
        <div className="max-w-8xl group relative flex w-full items-center">
          {showSELeft && (
            <IconButton
              onClick={() => scroll('left', scrollRef3)}
              sx={scrollButtonStyle({ left: -24 })}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}
          <div
            className="no-scrollbar flex w-full snap-x flex-nowrap items-center gap-4 overflow-x-auto scroll-smooth px-4 md:justify-center"
            ref={scrollRef3}
            onScroll={() => checkScroll(scrollRef3, setshowSELeft, setshowSERight)}
          >
            {SEvents.map((event, index) => (
              <div key={event.id} className="flex-shrink-0 snap-center">
                <Eventcard
                  card={event}
                  index={index}
                  addToCart={handleCart}
                  onClick={(e) => handleCardInteraction(e, event, 'Signature Events')}
                  category="Signature Events"
                  isPurchased={checkPurchases(event)}
                  isInCart={checkCart(event)}
                />
              </div>
            ))}
          </div>
          {showSERight && (
            <IconButton
              onClick={() => scroll('right', scrollRef3)}
              sx={scrollButtonStyle({ right: -24 })}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        {/* Workshops Section */}
        <SectionHeader title="Workshops" />
        <div className="max-w-8xl group relative flex w-full items-center">
          {showWLeft && (
            <IconButton
              onClick={() => scroll('left', scrollRef4)}
              sx={scrollButtonStyle({ left: -24 })}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}
          <div
            className="no-scrollbar flex snap-x flex-nowrap items-center justify-start gap-4 overflow-x-auto scroll-smooth px-4"
            ref={scrollRef4}
            onScroll={() => checkScroll(scrollRef4, setshowWLeft, setshowWRight)}
          >
            {Workshops.map((workshop, index) => (
              <div key={workshop.id} className="flex-shrink-0 snap-center">
                <Eventcard
                  card={workshop}
                  index={index}
                  addToCart={handleCart}
                  onClick={(e) => handleCardInteraction(e, workshop, 'workshop')}
                  category="workshop"
                  isPurchased={checkPurchases(workshop)}
                  isInCart={checkCart(workshop)}
                />
              </div>
            ))}
          </div>
          {showWRight && (
            <IconButton
              onClick={() => scroll('right', scrollRef4)}
              sx={scrollButtonStyle({ right: -24 })}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

// Helper components & styles
const SectionHeader = ({ title }) => (
  <h2 className="animated-border mx-auto mb-4 mt-8 flex w-fit animate-fade-in-down justify-center rounded-full p-2 text-primary shadow-stGlow">
    {title}
  </h2>
);

const scrollButtonStyle = (pos) => ({
  ...pos,
  m: 0.5,
  display: 'flex',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'red',
  backgroundColor: '#0b0b0b',
  border: '1px solid red',
  zIndex: 10,
  '&:hover': { backgroundColor: '#0b0b0b', opacity: 0.9 },
});

export default Events;
