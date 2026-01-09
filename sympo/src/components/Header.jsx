import React, { useEffect, useState } from 'react';

const Header = ({ HomeRef, AboutRef, EventsRef, ContactRef, FAQsRef }) => {
  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };
  const tabItems = [
    { id: 1, name: 'Home' },
    { id: 2, name: 'About' },
    { id: 3, name: 'Events' },
    { id: 5, name: 'FAQs' },
    { id: 4, name: 'Contact us' },
  ];
  const [clickedTab, setClickedTab] = useState(1);
  useEffect(() => {
    switch (clickedTab) {
      case 1:
        scrollTo(HomeRef);
        break;
      case 2:
        scrollTo(AboutRef);
        break;
      case 3:
        scrollTo(EventsRef);
        break;
      case 4:
        scrollTo(ContactRef);
        break;
      case 5:
        scrollTo(FAQsRef);
        break;
    }
  }, [clickedTab]);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center p-4 z-50 animate-fade-in-down">
      <div className="bg-primary flex gap-10 px-6 py-3 rounded-full w-fit">
        {tabItems.map((item) => {
          return (
            <div
              key={item.id}
              className="hover:underline transition duration-75 hover:scale-110 cursor-pointer"
              onClick={() => setClickedTab(item.id)}
            >
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Header;
