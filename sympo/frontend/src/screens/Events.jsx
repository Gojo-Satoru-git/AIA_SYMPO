import { useState, useRef, useEffect, useContext } from 'react';
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
import LightningStrike from '../components/Lightning';
import TeamForm from '../components/teamForm';
import { eventcontext } from '../context/event.context';
import { workshopcontext } from '../context/workshop.context';
import { Signeventscontext } from '../context/SEvents.context';
import { usePurchases } from '../context/PurchaseContext';
import useCart from '../context/useCart';
import useToast from '../context/useToast';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Events = () => {
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const { showToast } = useToast();

  const countries = [
    'United States of America',
    'China',
    'India',
    'France',
    'United Kingdom',
    'Saudi Arabia',
    'Iran',
    'Turkey',
    'Germany',
    'Russia',
    'Brazil',
    'Pakistan',
    'Afghanistan',
    'Sweden',
    'Nigeria',
    'Israel',
    'Qatar',
    'United Arab Emirates',
    'Japan',
    'South Korea',
    'Indonesia',
    'Malaysia',
    'Hungary',
    'Poland',
    'Canada',
    'Australia',
    'Bangladesh',
    'Mexico',
    'South Africa',
  ];

  // --- States ---
  const [showForm, setShowForm] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [Selected, SetSelected] = useState('All');
  const [clicked, setClicked] = useState(false);

  // --- Lightning States ---
  const [isStriking, setIsStriking] = useState(false);
  const [strikeX, setStrikeX] = useState(0);

  const { addToCart, checkCart } = useCart();
  const { checkPurchases } = usePurchases();

  const [showLeft, setshowLeft] = useState(false);
  const [showRight, setshowRight] = useState(true);
  const [showWLeft, setshowWLeft] = useState(false);
  const [showWRight, setshowWRight] = useState(true);
  const [showSELeft, setshowSELeft] = useState(false);
  const [showSERight, setshowSERight] = useState(true);

  const [cardclicked, setCardclicked] = useState({ id: null, category: null });

  const eventext = useContext(eventcontext);
  const Workshops = useContext(workshopcontext);
  const SEvents = useContext(Signeventscontext);

  // --- Lightning Interaction Handler ---
  const handleInteraction = (e, item, category) => {
    const isMobile = window.innerWidth < 768;

    // If it's mobile, skip the lightning and go straight to the details
    if (isMobile) {
      setCardclicked({ id: item.id, category: category });
      setClicked(true);
      return; // Exit early so setIsStriking(true) is never called
    }

    // Desktop logic remains the same
    const xPos = (e.clientX / window.innerWidth) * 2 - 1;
    setStrikeX(xPos);
    setIsStriking(true);

    setTimeout(() => {
      setCardclicked({ id: item.id, category: category });
      setClicked(true);
    }, 400);
  };
  // --- Scroll Logic ---
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

  // --- Cart & Form Logic ---
  const handleCart = (item, type) => {
    if (type === 'Signature Events' || item.category === 'Signature Events' || item.isSignature) {
      setPendingItem({ item, type });
      setShowForm(true);
      return;
    }
    processAddToCart(item, type);
    showToast(`${item.title} added to cart!`, 'success');
  };

  const processAddToCart = (item, type) => {
    const price = Number(item.fees);
    addToCart({
      id: item.id,
      title: item.title,
      price: Number.isFinite(price) ? price : 0,
      type,
      isSignature: item.isSignature === true || type === 'Signature Events',
    });
  };

  // --- Effects ---
  useEffect(() => {
    document.body.style.overflow = clicked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clicked]);

  // Scroll resets
  useEffect(() => {
    if (scrollRef3.current) checkScroll(scrollRef3, setshowSELeft, setshowSERight);
  }, [SEvents]);
  useEffect(() => {
    if (scrollRef4.current) checkScroll(scrollRef4, setshowWLeft, setshowWRight);
  }, [Workshops]);
  useEffect(() => {
    if (scrollRef2.current) checkScroll(scrollRef2, setshowLeft, setshowRight);
  }, [Selected]);

  // Determine detail for modal
  let detail = null;
  if (cardclicked.id !== null) {
    const source =
      cardclicked.category === 'workshop'
        ? Workshops
        : cardclicked.category === 'Signature Events'
          ? SEvents
          : eventext;
    detail = source.find((i) => i.id === cardclicked.id);
  }

  const display = Selected === 'All' ? eventext : eventext.filter((e) => e.category === Selected);

  return (
    <>
      <style>{`
        @keyframes global-shake {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5px,-5px); }
          30% { transform: translate(5px,5px); }
          100% { transform: translate(0,0); }
        }
        .shake-active { animation: global-shake 0.2s ease-in-out; }
        .flash-active { filter: brightness(1.7) saturate(1.5); transition: filter 0.1s; }
      `}</style>

      {/* GLOBAL STRIKE LAYER */}
      {isStriking && (
        <LightningStrike
          trigger={isStriking}
          xOffset={strikeX}
          onComplete={() => setIsStriking(false)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md">
          <TeamForm
            title={pendingItem?.item.title}
            teamSize={pendingItem?.item.teamSize || 3}
            mini={pendingItem?.item.minTeamSize || 1}
            onclose={() => setShowForm(false)}
            countries={countries}
            onSuccess={() => {
              processAddToCart(pendingItem.item, pendingItem.type);
              setShowForm(false);
              setPendingItem(null);
            }}
          />
        </div>
      )}

      {clicked && detail && (
        <div
          className="animate-in fade-in fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm duration-500"
          onClick={(e) => e.target === e.currentTarget && setClicked(false)}
        >
          <EventDetails
            card={detail}
            itemCategory={cardclicked.category}
            onClose={() => setClicked(false)}
            checkPurchase={checkPurchases}
            isInCart={checkCart(detail)}
            isPurchased={checkPurchases(detail)}
            countries={countries}
          />
        </div>
      )}

      <div
        className={`flex min-h-screen flex-col p-10 transition-all ${isStriking ? 'shake-active flash-active' : ''}`}
      >
        {/* Category Filters */}
        <div className="mt-10 flex items-center justify-center py-10 text-primary">
          <ul className="flex flex-shrink-0 gap-5 text-primary md:gap-8 lg:justify-center">
            {['All', 'Technical', 'Non-Technical'].map((cat) => (
              <li
                key={cat}
                className={`animated-border animate-fade-in-down cursor-pointer rounded-full border-solid p-2 shadow-stGlow ${Selected === cat ? 'scale-125 bg-primary text-black' : ''}`}
                onClick={() => SetSelected(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 1: Events */}
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
                  onClick={(e) => handleInteraction(e, event, event.category)}
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

        {/* SECTION 2: Signature Events */}
        <div className="relative mt-0 text-primary">
          <h2 className="animated-border mx-auto mb-4 mt-8 flex w-fit animate-fade-in-down justify-center rounded-full p-2 shadow-stGlow sm:mt-5">
            Signature Events
          </h2>
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
              className="no-scrollbar  flex w-full snap-x flex-nowrap items-center gap-4 overflow-x-auto scroll-smooth px-4 md:justify-center"
              ref={scrollRef3}
              onScroll={() => checkScroll(scrollRef3, setshowSELeft, setshowSERight)}
            >
              {SEvents.map((event, index) => (
                <div key={event.id} className="flex-shrink-0 snap-center">
                  <Eventcard
                    card={event}
                    index={index}
                    addToCart={handleCart}
                    onClick={(e) => handleInteraction(e, event, 'Signature Events')}
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
        </div>

        {/* SECTION 3: Workshops */}
        <div className="relative mt-0 text-primary">
          <h2 className="animated-border mx-auto mb-4 mt-8 flex w-fit animate-fade-in-down justify-center rounded-full p-2 shadow-stGlow sm:mt-5">
            Workshops
          </h2>
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
              className="no-scrollbar  flex snap-x flex-nowrap items-center justify-start gap-4 overflow-x-auto scroll-smooth px-4"
              ref={scrollRef4}
              onScroll={() => checkScroll(scrollRef4, setshowWLeft, setshowWRight)}
            >
              {Workshops.map((workshop, index) => (
                <div key={workshop.id} className="flex-shrink-0 snap-center">
                  <Eventcard
                    card={workshop}
                    index={index}
                    addToCart={handleCart}
                    onClick={(e) => handleInteraction(e, workshop, 'workshop')}
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
      </div>
    </>
  );
};

// CSS Helper for Buttons
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
