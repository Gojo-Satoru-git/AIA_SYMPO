import React, { useEffect, useState } from 'react';

const NavMenubar = ({ HomeRef, AboutRef, EventsRef, ContactRef, FAQsRef }) => {
  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const tabItems = [
    { id: 1, name: 'Home', ref: HomeRef },
    { id: 2, name: 'About', ref: AboutRef },
    { id: 3, name: 'Events', ref: EventsRef },
    { id: 5, name: 'FAQs', ref: FAQsRef },
    { id: 4, name: 'Contact us', ref: ContactRef },
  ];

  const [clickedTab, setClickedTab] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const map = {
      1: HomeRef,
      2: AboutRef,
      3: EventsRef,
      4: ContactRef,
      5: FAQsRef,
    };
    map[clickedTab]?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clickedTab, HomeRef, AboutRef, EventsRef, ContactRef, FAQsRef]);

  return (
    <>
      {/**Desktop navigation */}
      <nav className="fixed top-5 left-0 w-full justify-center p-4 z-50 animate-fade-in-down hidden md:flex">
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

      {/*Mobile header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center md:hidden">
        <span className="text-primary uppercase tracking-widest">SYMPOSIUM</span>

        <button onClick={() => setIsOpen(true)} className="text-primary text-2xl">
          ☰
        </button>
      </nav>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}
      <aside
        className={`
            fixed right-4 top-20
            w-64
            bg-black/80 backdrop-blur-md
            border border-primary
            rounded-2xl
            shadow-stGlowStrong
            z-50 md:hidden

            transform transition-all duration-300 ease-out
            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}
        `}
      >
        <div className="flex flex-col gap-6 p-8 mt-5">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.ref)}
              className="
                text-primary uppercase tracking-widest text-sm
                text-left transition-all duration-300
                hover:text-white hover:translate-x-2
              "
            >
              {item.name}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default NavMenubar;
