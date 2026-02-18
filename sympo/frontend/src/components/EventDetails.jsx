import TeamForm from './teamForm';
import useCart from '../context/useCart';
import { useEffect, useRef, useState, useCallback } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { IconButton } from '@mui/material';
import { useSeatAval } from '../context/SeatAvalProvider';

function EventDetails({ card, onClose, checkPurchase, isPurchased, itemCategory, countries }) {
  const [showArrow, SetshowArrow] = useState(false);
  const [showAdd, setShowAdd] = useState(card.id === '16' || card.id === '17' || card.id === '18');
  const [showForm, SetshowForm] = useState(false);

  const { checkCart } = useCart();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const checkoverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    window.requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollable = scrollHeight > clientHeight;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 0;

      SetshowArrow((prev) => {
        const newValue = isScrollable && !isBottom;
        return prev !== newValue ? newValue : prev;
      });
    });
  }, []);

  const { checkSeatAval } = useSeatAval();

  const stock = checkSeatAval(card);

  useEffect(() => {
    const checkInitialScroll = () => {
      if (scrollRef.current) {
        SetshowArrow(scrollRef.current.scrollHeight > scrollRef.current.clientHeight);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        SetshowArrow(!entry.isIntersecting);
      },
      { root: scrollRef.current, threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    checkInitialScroll();

    return () => observer.disconnect();
  }, [card]);

  return (
    <>
      {showForm && (card.id === '17' || card.id === '16' || card.id === '18') ? (
        <TeamForm
          title={card.title}
          teamSize={card.teamSize}
          mini={card.miniTeamSize}
          setShowAdd={setShowAdd}
          countries={countries}
          onclose={() => {
            SetshowForm(false);
          }}
          isDisabledAll={isPurchased}
        />
      ) : (
        <>
          <button
            onClick={onClose}
            className="absolute right-4 top-2 text-xl font-bold text-primary"
          >
            ✕
          </button>
          <div className="relative mx-auto mt-10 max-w-3xl">
            <div
              ref={scrollRef}
              className="isolation-auto mx-auto mt-10 flex max-h-[90vh] max-w-3xl transform-gpu flex-col items-center gap-4 overflow-auto rounded-md border-primary bg-black/70 p-8 shadow-stGlow will-change-scroll [-ms-overflow-style:none] [scrollbar-width:none] md:border [&::-webkit-scrollbar]:hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img
                src={card.image}
                alt={`AIA SYMPO TEKHORA26 ${card.title.toUpperCase()}`}
                className="aspect-[4/5] w-72 rounded-md object-cover shadow-stGlow"
              />

              <div className="w-full max-w-2xl px-4">
                {/* --- Workshop Specific Metadata --- */}
                {itemCategory === 'workshop' && (
                  <div className="mb-6 flex flex-col items-center gap-2">
                    <h2 className="text-center text-2xl font-bold tracking-tight text-white">
                      {card.title}
                    </h2>
                    <div className="flex gap-3">
                      <span className="rounded-md border border-primary/30 bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
                        Trainer: {card.trainer}
                      </span>
                      {card.company && (
                        <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                          {card.company}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* --- Description Handling --- */}
                {itemCategory === 'workshop' ? (
                  <div className="space-y-3">
                    <p className="border-b border-primary/30 pb-1 text-sm font-bold uppercase tracking-wider text-primary">
                      What you will learn:
                    </p>
                    <ul className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
                      {card.description.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm leading-tight text-gray-300"
                        >
                          <span className="mt-1 text-primary">▹</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-center text-lg leading-relaxed tracking-wide text-gray-300">
                    {card.description}
                  </p>
                )}

                {card.id === '17' && (
                  <div className="mt-6 space-y-4 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                      Skill Development • Inclusivity • Atmosphere
                    </p>
                    <div className="border-primary-700 inline-block rounded-full border bg-primary px-4 py-1">
                      <span className="text-sm font-medium text-white">Committee: </span>
                      <span className="text-white-300 text-sm font-bold">UNHRC</span>
                    </div>
                    <div className="px-4">
                      <p className="mb-1 text-xs uppercase tracking-tighter text-primary">Agenda</p>
                      <p className="text-base italic leading-relaxed text-gray-300">
                        "The evolving role of belief systems and digital technologies in education
                        and their implications for freedom of thought and expression"
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {card.id == '13' && (
                <div className="flex gap-3">
                  <span className="rounded-md border border-primary/30 bg-primary/20 px-3 py-1 text-sm font-semibold uppercase text-primary">
                    <span className="font-bold text-white">Note: </span>
                    Bring your own laptop
                  </span>
                </div>
              )}
              {/* Info Bar */}
              <div className="flex w-full flex-wrap items-center justify-around rounded-lg border border-primary/30 bg-black/40 p-2 text-lg text-primary">
                {itemCategory !== 'workshop' && (
                  <div className="text-center">
                    <span className="block text-sm font-bold uppercase opacity-70">Team Size</span>
                    {card.miniTeamSize && <span className="text-xl">{card.miniTeamSize}-</span>}
                    <span className="text-xl">{card.teamSize}</span>
                  </div>
                )}

                <div className="text-center">
                  <span className="block text-sm font-bold uppercase opacity-70">Date & Time</span>
                  <span className="text-xl">
                    {card.date} | {card.time}
                  </span>
                </div>

                <div className="items-ctenter flex flex-col border-primary/30 sm:border-l sm:pl-6">
                  <span className="mb-2 text-sm font-bold uppercase opacity-70">Contacts</span>
                  <div className="flex gap-6 text-center">
                    <div>
                      <div className="font-bold text-white">{card.contact.name1}</div>
                      <div className="text-sm">{card.contact.phone1}</div>
                    </div>
                    {card.contact.name2 && (
                      <div>
                        <div className="font-bold text-white">{card.contact.name2}</div>
                        <div className="text-sm">{card.contact.phone2}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {itemCategory === 'Signature Events' ? (
                  <button
                    className={`rounded-full px-4 py-2 font-bold shadow-stGlow transition-all ${
                      isPurchased
                        ? 'border border-primary bg-zinc-800 text-white hover:bg-zinc-700'
                        : !showAdd || checkCart(card)
                          ? 'cursor-not-allowed bg-primary text-black opacity-35'
                          : 'bg-primary text-black hover:scale-105'
                    }${stock ? '' : ' cursor-not-allowed opacity-35'}`}
                    onClick={() => {
                      if (!stock) return;
                      if (isPurchased || (showAdd && !checkCart(card))) {
                        SetshowForm(true);
                      }
                    }}
                  >
                    {stock ? (isPurchased ? 'View Team' : 'Add Team Details') : 'Sold Out'}
                  </button>
                ) : null}
              </div>

              <a
                href={card.wplink}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-full border border-primary bg-primary/5 px-6 py-2 shadow-stGlowStrong transition-all duration-300"
              >
                <div className="animated-border flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <WhatsAppIcon className="h-6 w-6 text-primary" sx={{ fontSize: 28 }} />
                </div>
                <span className="text-sm uppercase tracking-widest text-white">Join the group</span>
              </a>

              {card.id === '17' && (
                <>
                  <h1 className="mx-auto mb-3 mt-10 w-fit rounded-md border border-primary p-2 px-5 text-xl font-bold uppercase tracking-widest text-primary shadow-stGlow">
                    Country Matrix
                  </h1>
                  <div className="mx-auto mb-6 max-w-md rounded-lg border border-primary/40 bg-primary/10 p-3 text-center">
                    <p className="text-sm leading-relaxed text-gray-200">
                      <span className="font-bold text-primary">Note:</span> The country will be
                      assigned and informed via email 4 days prior to the event.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 rounded-lg border border-primary/30 bg-black/50 p-6 md:grid-cols-4">
                    {countries.sort().map((country) => (
                      <div
                        key={country}
                        className="flex min-h-[60px] items-center justify-center rounded-sm border border-primary/20 bg-black/40 p-3 text-center text-xs font-medium uppercase tracking-widest text-white/90 transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary hover:shadow-stGlow"
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {itemCategory !== 'workshop' && card.id === '17' && (
                <div>
                  <p className="mb-2 text-lg italic text-primary">Rules:</p>
                  <ul className="list-inside list-disc text-justify text-gray-400">
                    {card.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Ensure bottom sentinel exists for workshop category to trigger scroll arrow logic */}
              {itemCategory === 'workshop' && <div ref={bottomRef} className="h-1 w-full" />}
              <div ref={bottomRef} className="h-1 w-full" />
            </div>

            {showArrow && (
              <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="animate-bounce rounded-full bg-black/50 px-2 text-xl text-red-600 drop-shadow-md">
                  ↓
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default EventDetails;
