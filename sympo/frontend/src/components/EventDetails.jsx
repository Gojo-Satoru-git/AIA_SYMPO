import React from 'react';
import useToast from '../context/useToast';
function EventDetails({ card, onClose, AddtoCart }) {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={onClose} className="absolute top-2 right-4 text-primary text-xl font-bold">
        ✕
      </button>

      <div className="flex items-center flex-col gap-4 p-8 md:border border-primary md:shadow-stGlow rounded-md max-h-[90vh] max-w-3xl mx-auto mt-10 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-end">
          <img
            src={card.image}
            alt={card.title}
            className="w-72 aspect-[4/5] object-cover  rounded-md shadow-stGlow"
          />
          <span className="   text-red-600 text-2xl animate-bounce ">↓</span>
        </div>
        <p className="text-primary text-lg text-center ">{card.description}</p>
        <div className="w-full bg-black/40 border border-primary/30 rounded-lg p-2 flex flex-wrap justify-around items-center gap-6 text-primary text-lg">
          {/* Team Size */}
          <div className="text-center">
            <span className="block font-bold uppercase text-sm opacity-70">Team Size</span>
            <span className="text-xl">{card.teamSize}</span>
          </div>

          {/* Date & Time */}
          <div className="text-center">
            <span className="block font-bold uppercase text-sm opacity-70">Date & Time</span>
            <span className="text-xl">
              {card.date} | {card.time}
            </span>
          </div>

          {/* Contacts Group */}
          <div className="flex flex-col items-center sm:border-l border-primary/30 sm:pl-6">
            <span className="font-bold uppercase text-sm opacity-70 mb-2">Contacts</span>

            <div className="flex gap-6 text-center">
              {/* Contact 1 */}
              <div>
                <div className="font-bold text-white">{card.contact.name1}</div>
                <div className="text-sm">{card.contact.phone1}</div>
              </div>

              {/* Contact 2 */}
              {card.contact.name2 && (
                <div>
                  <div className="font-bold text-white">{card.contact.name2}</div>
                  <div className="text-sm">{card.contact.phone2}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className="bg-primary text-black rounded-full px-4 py-2 shadow-stGlow"
          onClick={() => {
            AddtoCart(card, card.category ? 'event' : 'workshop');
            showToast(`${card.title} added check the registration`, 'add');
          }}
        >
          Add
        </button>
        <p className="text-primary text-lg italic">Rules : {card.rules}</p>
      </div>
    </>
  );
}

export default EventDetails;
