import React, { useState, useRef } from 'react';
import Eventcard from '../components/Eventcard';
const Events = () => {
  const scrollRef = useRef(null);
  const [Selected, SetSelected] = useState('All');

  const scroll = (directions) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = directions === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const eventext = [
    {
      title: 'Event1',
      id: '1',
      image: '/event1.png',
      description: 'This is event 1',
      category: 'Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
    {
      title: 'Event2',
      id: '2',
      image: '/event2.png',
      description: 'This is event 2',
      category: 'Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
    {
      title: 'Event3',
      id: '3',
      image: '/event3.png',
      description: 'This is event 3',
      category: 'Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
    {
      title: 'EventA',
      id: '4',
      image: '/eventA.png',
      description: 'This is event A',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
    {
      title: 'EventB',
      id: '5',
      image: '/eventB.png',
      description: 'This is event B',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
    {
      title: 'EventC',
      id: '6',
      image: '/eventC.png',
      description: 'This is event C',
      category: 'Non-Technical',
      date: '2026-02-21',
      time: '10:00 AM',
    },
  ];
  const display =
    Selected === 'All' ? eventext : eventext.filter((event) => event.category === Selected);
  return (
    <div className="flex flex-col items-center p-10 bg-black min-h-screen">
      <div className="relative w-full max-w-7xl flex items-center group">
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute -left-4 lg:-left-12 z-20 p-2 text-primary text-3xl lg:text-5xl hover:scale-110 transition-transform"
        >
          <span className="mb-1">‹</span>
        </button>
        <div
          ref={scrollRef}
          className="flex justify-start items-start gap-4 mt-40 md:mt-42 overflow-x-auto no-scrollbar scroll-smooth pb-10 snap-x snap-mandatory px-4"
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
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className=" absolute -right-4  lg:-right-12 z-10 p-4 text-primary text-3xl lg:text-5xl hover:scale-125 transition-transform items-center md:mt-42"
        >
          <span className="mb-1">›</span>
        </button>
      </div>

      <div className="flex  justify-center items-center py-10 text-primary">
        <ul className="flex flex-wrap justify-center gap-5 md:gap-8 text-primary">
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
    </div>
  );
};
export default Events;
