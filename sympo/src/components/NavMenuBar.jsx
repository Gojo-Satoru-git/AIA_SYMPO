import React, { useEffect, useState } from 'react';

const NavMenubar = ({ HomeRef, AboutRef, EventsRef, ContactRef, FAQsRef }) => {
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
    <nav className="fixed top-5 left-0 w-full flex justify-center p-4 z-50 animate-fade-in-down">
      <div
        className="
          bg-black/60 backdrop-blur-md
          border border-primary
          flex gap-10 px-8 py-3 rounded-full w-fit
          shadow-stGlow
        "
      >
        {tabItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setClickedTab(item.id)}
            className="
                relative cursor-pointer
                text-primary uppercase tracking-widest text-sm
                transition-all duration-300 ease-out
                hover:text-white hover:-translate-y-1

                after:absolute after:-bottom-0.5
                after:left-1/2 after:-translate-x-1/2
                after:h-[2px] after:w-0
                after:bg-primary
                after:shadow-stGlowStrong
                after:transition-all after:duration-300 after:delay-150
                hover:after:w-full
              "
          >
            {item.name}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavMenubar;
