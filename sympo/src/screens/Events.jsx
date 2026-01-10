import React, { useState } from 'react';
import Eventcard from '../components/Eventcard';
const Events = () => {
  const [Selected, SetSelected] = useState('All');
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
      <div className="flex flex-grow justify-center items-start gap-4 mt-32">
        {display.map((events) => (
          <Eventcard
            key={events.id}
            title={events.title}
            desc={events.description}
            img={events.image}
            date={events.date}
            time={events.time}
          />
        ))}
      </div>

      <div className="flex  justify-center items-center py-10 text-primary">
        <ul className="flex justify-center gap-8">
          <li
            className={` p-2 rounded-full hover:animate-popup border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'All' ? 'bg-primary text-black' : ''}`}
            onClick={() => SetSelected('All')}
          >
            All
          </li>
          <li
            className={`p-2 rounded-full hover:animate-popup border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'Technical' ? 'bg-primary text-black' : ''}`}
            onClick={() => SetSelected('Technical')}
          >
            Technical
          </li>
          <li
            className={` p-2 rounded-full hover:animate-popup border-solid animated-border animate-fade-in-down shadow-stGlow cursor-pointer ${Selected === 'Non-Technical' ? 'bg-primary text-black' : ''}`}
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
