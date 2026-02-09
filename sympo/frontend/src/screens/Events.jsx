import { useState, useRef, useEffect, useContext } from 'react';
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
import { eventcontext } from '../context/event.context';
import { workshopcontext } from '../context/workshop.context';
import { usePurchases } from '../context/PurchaseContext';
import useCart from '../context/useCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import useToast from '../context/useToast';
import TeamForm from '../components/teamForm';
import { Signeventscontext } from '../context/SEvents.context';
const Events = () => {
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const [Selected, SetSelected] = useState('All');
  const { addToCart, checkCart } = useCart();
  const { checkPurchases } = usePurchases();

  const [clicked, setClicked] = useState(false);
  const [showLeft, setshowLeft] = useState(false);
  const [showRight, setshowRight] = useState(true);
  const [showWLeft, setshowWLeft] = useState(false);
  const [showWRight, setshowWRight] = useState(true);
  const [showSELeft, setshowSELeft] = useState(false);
  const [showSERight, setshowSERight] = useState(true);
  const [cardclicked, setCardclicked] = useState({
    id: null,
    category: null,
  });

  const scroll = (directions, scrollRef) => {
    const { current } = scrollRef;
    if (current) {
      const firstCard = current.firstElementChild;
      const scrollSize = firstCard ? firstCard.clientWidth + 16 : 200;
      const scrollAmount = directions === 'left' ? -scrollSize : scrollSize;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const eventext = useContext(eventcontext);
  const Workshops = useContext(workshopcontext);
  const SEvents = useContext(Signeventscontext);

  let detail;

  useEffect(() => {
    if (clicked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clicked]);

  const checkScroll = (ref, setLeft, setRight) => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    if (scrollLeft > 20) {
      setLeft(true);
    } else {
      setLeft(false);
    }
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      setRight(false);
    } else {
      setRight(true);
    }
  };
  const handleCart = (item, type) => {
    if (type === 'Signature Events' || item.category === 'Signature Events' || item.isSignature) {
      setPendingItem({ item, type });
      setShowForm(true);
      return; // Stop here, wait for form submission
    }
    processAddToCart(item, type);
    showToast(`${item.title} added to cart!`, 'success');
  };
  const processAddToCart = (item, type) => {
    const price = Number(item.fees);
    const cartItem = {
      id: item.id,
      title: item.title,
      price: Number.isFinite(price) ? price : 0,
      type,
      isSignature: item.isSignature === true || type === 'Signature Events',
    };
    addToCart(cartItem);
  };

  useEffect(() => {
    if (scrollRef3.current) {
      scrollRef3.current.scroll({ left: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        checkScroll(scrollRef3, setshowSELeft, setshowSERight);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [SEvents]);

  useEffect(() => {
    if (scrollRef4.current) {
      scrollRef4.current.scroll({ left: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        checkScroll(scrollRef4, setshowWLeft, setshowWRight);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [Workshops]);

  useEffect(() => {
    if (scrollRef2.current) {
      scrollRef2.current.scroll({ left: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        checkScroll(scrollRef2, setshowLeft, setshowRight);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [Selected]);

  if (cardclicked !== null) {
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
      {showForm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-md">
          <TeamForm
            title={pendingItem?.item.title}
            teamSize={pendingItem?.item.teamSize || 3} // Fallback if not in data
            mini={pendingItem?.item.minTeamSize || 1}
            onclose={() => setShowForm(false)}
            onSuccess={() => {
              processAddToCart(pendingItem.item, pendingItem.type);
              setShowForm(false);
              setPendingItem(null);
            }}
          />
        </div>
      )}
      {clicked && (
        <div
          className="fixed left-0 top-0 z-50 h-full w-full bg-black/60 backdrop-blur-sm"
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
      <div className={`flex min-h-screen flex-col p-10 sm:justify-start`}>
        <div
          className={`mt-10 flex items-center justify-center py-10 text-primary sm:mt-10 md:mt-10`}
        >
          <ul className="flex flex-shrink-0 gap-5 text-primary md:gap-8 lg:justify-center">
            <li
              className={`animated-border animate-fade-in-down cursor-pointer rounded-full border-solid p-2 shadow-stGlow ${Selected === 'All' ? 'scale-125 bg-primary text-black' : ''}`}
              onClick={() => SetSelected('All')}
            >
              All
            </li>
            <li
              className={`animated-border animate-fade-in-down cursor-pointer rounded-full border-solid p-2 shadow-stGlow ${Selected === 'Technical' ? 'scale-125 bg-primary text-black' : ''}`}
              onClick={() => SetSelected('Technical')}
            >
              Technical
            </li>
            <li
              className={`animated-border animate-fade-in-down cursor-pointer rounded-full border-solid p-2 shadow-stGlow ${Selected === 'Non-Technical' ? 'scale-125 bg-primary text-black' : ''}`}
              onClick={() => SetSelected('Non-Technical')}
            >
              Non-Technical
            </li>
          </ul>
        </div>

        <div className="max-w-8xl group relative flex w-full items-center">
          {showLeft && (
            <IconButton
              onClick={() => scroll('left', scrollRef2)}
              sx={{
                m: 0.5,
                display: 'flex',
                position: 'absolute',
                left: { xs: 0, md: -24 },
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'red',
                backgroundColor: '#0b0b0b',
                border: '1px solid red',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: '#0b0b0b',
                  opacity: 0.9,
                },
                '&:active': {
                  backgroundColor: '#0b0b0b',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: '#0b0b0b',
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}

          <div
            ref={scrollRef2}
            onScroll={() => checkScroll(scrollRef2, setshowLeft, setshowRight)}
            className="no-scrollbar touch-action-pan-x flex snap-x items-center justify-start gap-4 overflow-x-auto scroll-smooth px-4"
          >
            {display.map((events, index) => {
              const itemInCart = checkCart(events);
              const itemPurchased = checkPurchases(events);
              return (
                <div key={`${Selected}-${events.id}`} className="flex-shrink-0 snap-center">
                  <Eventcard
                    card={events}
                    index={index}
                    addToCart={handleCart}
                    onClick={() => {
                      setClicked(!clicked);
                      setCardclicked({ id: events.id, category: events.category });
                    }}
                    category={events.category}
                    backside={events.backside}
                    fallbackImage={events.fallbackImage}
                    isPurchased={itemPurchased}
                    isInCart={itemInCart}
                  />
                </div>
              );
            })}
          </div>
          {showRight && (
            <IconButton
              onClick={() => scroll('right', scrollRef2)}
              sx={{
                display: 'flex',
                position: 'absolute',
                right: { xs: 0, md: -24 },
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'red',
                backgroundColor: '#0b0b0b',
                border: '1px solid red',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: '#0b0b0b',
                  opacity: 0.9,
                },
                '&:active': {
                  backgroundColor: '#0b0b0b',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: '#0b0b0b',
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        <div className="relative mt-0 text-primary">
          <h2 className="animated-border mx-auto mb-4 mt-8 flex w-fit animate-fade-in-down justify-center rounded-full p-2 shadow-stGlow sm:mt-5">
            Signature Events
          </h2>
          <div className="max-w-8xl group relative flex w-full items-center">
            {showSELeft && (
              <IconButton
                onClick={() => scroll('left', scrollRef3)}
                sx={{
                  m: 0.5,
                  display: 'flex',
                  position: 'absolute',
                  left: { xs: 0, md: -24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'red',
                  backgroundColor: '#0b0b0b',
                  border: '1px solid red',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: '#0b0b0b',
                    opacity: 0.9,
                  },
                  '&:active': {
                    backgroundColor: '#0b0b0b',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#0b0b0b',
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            )}
            <div
              className="no-scrollbar touch-action-pan-x flex w-full snap-x flex-nowrap items-center gap-4 overflow-x-auto scroll-smooth px-4 md:justify-center"
              ref={scrollRef3}
              onScroll={() => {
                checkScroll(scrollRef3, setshowSELeft, setshowSERight);
              }}
            >
              {SEvents.map((event, index) => {
                const itemInCart = checkCart(event);
                const itemPurchased = checkPurchases(event);
                return (
                  <div key={`${Selected}-${event.id}`} className="flex-shrink-0 snap-center">
                    <Eventcard
                      card={event}
                      index={index}
                      addToCart={handleCart}
                      onClick={() => {
                        setClicked(!clicked);
                        setCardclicked({ id: event.id, category: 'Signature Events' });
                      }}
                      category="Signature Events"
                      backside={event.backside}
                      fallbackImage={event.fallbackImage}
                      isPurchased={itemPurchased}
                      isInCart={itemInCart}
                    />
                  </div>
                );
              })}
            </div>
            {showSERight && (
              <IconButton
                onClick={() => scroll('right', scrollRef3)}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  right: { xs: 0, md: -24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'red',
                  backgroundColor: '#0b0b0b',
                  border: '1px solid red',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: '#0b0b0b',
                    opacity: 0.9,
                  },
                  '&:active': {
                    backgroundColor: '#0b0b0b',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#0b0b0b',
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </div>
        <div className="relative mt-0 text-primary">
          <h2 className="animated-border mx-auto mb-4 mt-8 flex w-fit animate-fade-in-down justify-center rounded-full p-2 shadow-stGlow sm:mt-5">
            Workshops
          </h2>
          <div className="max-w-8xl group relative flex w-full items-center">
            {showWLeft && (
              <IconButton
                onClick={() => scroll('left', scrollRef4)}
                sx={{
                  m: 0.5,
                  display: 'flex',
                  position: 'absolute',
                  left: { xs: 0, md: -24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'red',
                  backgroundColor: '#0b0b0b',
                  border: '1px solid red',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: '#0b0b0b',
                    opacity: 0.9,
                  },
                  '&:active': {
                    backgroundColor: '#0b0b0b',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#0b0b0b',
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            )}
            <div
              className="no-scrollbar touch-action-pan-x flex snap-x flex-nowrap items-center justify-start gap-4 overflow-x-auto scroll-smooth px-4"
              ref={scrollRef4}
              onScroll={() => {
                checkScroll(scrollRef4, setshowWLeft, setshowWRight);
              }}
            >
              {Workshops.map((workshop, index) => {
                const itemInCart = checkCart(workshop);
                const itemPurchased = checkPurchases(workshop);
                return (
                  <div key={`${Selected}-${workshop.id}`} className="flex-shrink-0 snap-center">
                    <Eventcard
                      card={workshop}
                      index={index}
                      addToCart={handleCart}
                      onClick={() => {
                        setClicked(!clicked);
                        setCardclicked({ id: workshop.id, category: 'workshop' });
                      }}
                      category="workshop"
                      backside={workshop.backside}
                      fallbackImage={workshop.fallbackImage}
                      isPurchased={itemPurchased}
                      isInCart={itemInCart}
                    />
                  </div>
                );
              })}
            </div>
            {showWRight && (
              <IconButton
                onClick={() => scroll('right', scrollRef4)}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  right: { xs: 0, md: -24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'red',
                  backgroundColor: '#0b0b0b',
                  border: '1px solid red',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: '#0b0b0b',
                    opacity: 0.9,
                  },
                  '&:active': {
                    backgroundColor: '#0b0b0b',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#0b0b0b',
                  },
                }}
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
export default Events;
