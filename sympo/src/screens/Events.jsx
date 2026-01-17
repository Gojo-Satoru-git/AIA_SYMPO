import React, { useState, useRef, useEffect } from 'react';
import Eventcard from '../components/Eventcard';
import EventDetails from '../components/EventDetails';
const Events = () => {
  const scrollRef2 = useRef(null);
  const [Selected, SetSelected] = useState('All');

  const [clicked, setClicked] = React.useState(false);
  const [cart, setCart] = React.useState([]);

  const AddtoCart = (event) => {
    const already = cart.some((item) => item.id == event.id);
    if (!already) {
      setCart([...cart, event]);
      alert(`${event.title} Item added to Cart`);
    } else {
      alert('Item already in Cart');
    }
  };

  console.log(cart);
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
  const eventext = [
    {
      title: 'IPL Auction',
      id: '6',
      image: '/eventB.png',
      backside: './assets/Hopper.png',
      description: 'This is event B',
      category: 'Non-Technical',
      teamSize: '6',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Abinash',
        phone1: '6383467363',
        name2: 'Joel',
        phone2: '6381165383',
      },
    },
    {
      title: 'Call Of Query',
      id: '3',
      image: '/event3.png',
      backside: './assets/Eleven.png',
      description: 'This is event 3',
      teamSize: '4',
      category: 'Technical',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Surya',
        phone1: '8148124727',
        name2: 'Jayasree',
        phone2: '8072064228',
      },
    },
    {
      title: 'Connextions',
      id: '8',
      image: '/eventC.png',
      backside: './assets/steve.jpeg',
      teamSize: '6',
      description: 'This is event C',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Itikash',
        phone1: '9786398639',
        name2: 'Karthikeyan',
        phone2: '8825535520',
      },
    },
    {
      title: 'Tournament of strategies',
      id: '1',
      image: '/event1.png',
      backside: './assets/mike.png',
      description: 'This is event 1',
      category: 'Technical',
      date: '2026-02-21',
      teamSize: '3',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Chandru',
        phone1: '7667634519',
        name2: 'Mirsha',
        phone2: '9940358967',
      },
    },
    {
      title: 'Treasure Hunt',
      id: '9',
      image: '/eventC.png',
      backside: './assets/will.png',
      teamSize: '7',
      description: 'This is event C',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Jhanavi',
        phone1: '9384654366',
        name2: 'Nivetha',
        phone2: '9840077658',
      },
    },
    {
      title: 'Ninja Coding',
      id: '4',
      image: '/event3.png',
      backside: './assets/Dustin.png',
      description: 'This is event 3',
      teamSize: '4',
      category: 'Technical',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Mekesh',
        phone1: '9952598472',
        name2: 'Rasheen Fahmi',
        phone2: '7867896416',
      },
    },
    {
      title: 'ADZAP',
      id: '5',
      image: '/eventA.png',
      backside: './assets/Max.png',
      description: 'This is event A',
      category: 'Non-Technical',
      teamSize: '5',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Sudhahar',
        phone1: '9363595133',
        name2: 'Karthik Raja',
        phone2: '9361139648',
      },
    },
    {
      title: 'coding with AI',
      id: '2',
      image: '/event2.png',
      backside: './assets/vecna.jpeg',
      description: 'This is event 2',
      category: 'Technical',
      teamSize: '4',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'SriLakshmi',
        phone1: '9566208249',
        name2: 'Rakshitha',
        phone2: '8610209696',
      },
    },
    {
      title: 'Fandom Quiz',
      id: '7',
      image: '/eventC.png',
      backside: './assets/Nancy.png',
      teamSize: '6',
      description: 'This is event C',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Pragadheeshwaran',
        phone1: '8903098801',
        name2: 'Ganesh',
        phone2: '7339532544',
      },
    },
  ];
  const Workshops = [
    {
      title: 'Workshop1',
      id: '10',
      image: '/workshop1.png',
      backside: './assets/Hopper.png',
      description: 'This is workshop 1',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Dipakumar',
        phone1: '7639933600',
        name2: 'Ramkumar',
        phone2: '8825538554',
      },
    },
    {
      title: 'Workshop2',
      id: '11',
      image: '/workshop2.png',
      backside: './assets/Hopper.png',
      description: 'This is workshop 2',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Kamalnath',
        phone1: '9150580147',
        name2: 'Albin Joseph',
        phone2: '9566322365',
      },
    },
  ];
  let detail;
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
        <div className="fixed top-0 left-0 z-50 w-full h-full  backdrop-blur-sm">
          <EventDetails card={detail} onClose={() => setClicked(false)} AddtoCart={AddtoCart} />
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
                  img={events.image}
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
            className=" absolute mb-auto -right-2  lg:-right-10 z-10 p-4 text-primary text-3xl lg:text-5xl hover:scale-125 transition-transform items-center md:mt-42"
          >
            <span className="mb-auto">›</span>
          </button>
        </div>
        <div className="relative text-primary mt-0">
          <h2 className="p-2 rounded-full border-solid flex justify-center animated-border animate-fade-in-down shadow-stGlow mt-8 sm:mt-5">
            Workshops
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
        </div>
      </div>
    </>
  );
};
export default Events;
