import React, { useState, useRef, useEffect, useContext } from 'react';
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
import useCart from '../context/useCart';
import { eventcontext } from '../context/event.context';
import { workshopcontext } from '../context/workshop.context';
const Events = () => {
  const scrollRef2 = useRef(null);
  const [Selected, SetSelected] = useState('All');
  const { addToCart,check} = useCart();
  const [clicked, setClicked] = React.useState(false);

  const [cardclicked, setCardclicked] = React.useState({
    id: null,
    category: null,
  });

  const scroll = (directions) => {
    const { current } = scrollRef2;
    if (current) {
      const scrollAmount = directions === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const handleCart = (item, type) => {
    const price = Number(item.fees);
    addToCart({
      id: item.id,
      title: item.title,
      price: Number.isFinite(price) ? price : 0,
      type,
    });
  };
  const eventext = useContext(eventcontext);
  const Workshops = useContext(workshopcontext);

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

  useEffect(() => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [Selected]);
  if (cardclicked !== null) {
    detail =
      cardclicked.category === 'workshop'
        ? Workshops.find((w) => w.id === cardclicked.id)
        : eventext.find((e) => e.id === cardclicked.id);
  }
  const display =
    Selected === 'All' ? eventext : eventext.filter((event) => event.category === Selected);
  return (
    <>
      {clicked && (
        <div
          className="fixed top-0 left-0 z-50 w-full h-full  bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setClicked(false);
              setCardclicked({ id: null, category: null });
            }
          }}
        >
          <EventDetails
            card={detail}
            onClose={() => setClicked(false)}
            AddtoCart={handleCart}
            check={check}
          />
        </div>
      )}
      <div className={`flex flex-col p-10 sm:justify-start  min-h-screen`}>
        <div
          className={`flex  justify-center items-center py-10 text-primary mt-10 md:mt-10 sm:mt-10 `}
        >
          <ul className="flex flex-shrink-0 lg:justify-center gap-5 md:gap-8 text-primary">
            <li
              className={` p-2 rounded-full border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'All' ? 'bg-primary text-black scale-125' : ''}`}
              onClick={() => SetSelected('All')}
            >
              All
            </li>
            <li
              className={`p-2 rounded-full border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'Technical' ? 'bg-primary text-black scale-125' : ''}`}
              onClick={() => SetSelected('Technical')}
            >
              Technical
            </li>
            <li
              className={` p-2 rounded-full border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'Non-Technical' ? 'bg-primary text-black scale-125' : ''}`}
              onClick={() => SetSelected('Non-Technical')}
            >
              Non-Technical
            </li>
          </ul>
        </div>

        <div className="relative w-full max-w-8xl flex items-center group">
          <button
            onClick={() => scroll('left')}
            className="hidden md:block absolute mb-auto -left-2 lg:-left-5 z-20 p-2 text-primary text-3xl lg:text-5xl hover:scale-110 transition-transform"
          >
            <span className="mb-auto">‹</span>
          </button>
          <div
            ref={scrollRef2}
            className="flex justify-start items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x  px-4"
          >
            {display.map((events, index) => (
              <div key={`${Selected}-${events.id}`} className="flex-shrink-0 snap-center">
                <Eventcard
                  title={events.title}
                  desc={events.description}
                  image={events.image}
                  date={events.date}
                  time={events.time}
                  category={events.category}
                  index={index}
                  id={events.id}
                  onClick={() => {
                    setClicked(!clicked);
                    setCardclicked({ id: events.id, category: events.category });
                  }}
                  backside={events.backside}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="hidden md:block absolute mb-auto -right-2  lg:-right-10 z-10 p-4 text-primary text-3xl lg:text-5xl hover:scale-125 transition-transform items-center md:mt-42"
          >
            <span className="mb-auto">›</span>
          </button>
        </div>
        <span className="  lg:hidden text-red-600 text-2xl animate-bounce flex justify-end">→</span>
        <div className="relative text-primary mt-0">
          <h2 className="p-2 rounded-full w-fit mx-auto flex justify-center animated-border animate-fade-in-down shadow-stGlow mt-8 sm:mt-5">
            Other Events
          </h2>
          <div className="flex flex-nowrap justify- sm:justify-center items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x  px-4">
            {Workshops.map((workshop, index) => (
              <div
                key={`${Selected}-${workshop.id}`}
                className="flex justify-center mt-8 sm:mt-5 snap-center"
              >
                <Eventcard
                  title={workshop.title}
                  desc={workshop.description}
                  index={index}
                  category="workshop"
                  date={workshop.date}
                  time={workshop.time}
                  id={workshop.id}
                  onClick={() => {
                    setClicked(!clicked);
                    setCardclicked({ id: workshop.id, category: 'workshop' });
                  }}
                  backside={workshop.backside}
                />
              </div>
            ))}
          </div>
          <span className="  lg:hidden text-red-600 text-2xl animate-bounce flex justify-end">
            →
          </span>
        </div>
      </div>
    </>
  );
};
export default Events;
