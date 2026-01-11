import React from 'react';

function EventDetails({ card, onClose }) {
  return (
    <>
      <button onClick={onClose} className="absolute top-2 right-4 text-primary text-xl font-bold">
        ✕
      </button>
      <div className="flex items-center flex-col gap-4 p-3 rounded-md max-w-3xl mx-auto mt-10 overflow-auto">
        <img
          src={card.image}
          alt={card.title}
          className="w-72 h-64 object-cover  rounded-md shadow-stGlow"
        />
        <h2 className="text-3xl font-bold text-primary text-center">{card.title}</h2>
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
          <div className="flex flex-col items-center border-l border-primary/30 pl-6">
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
        <button className="bg-primary text-black rounded-full p-2 shadow-stGlow">
          {' '}
          Add to cart
        </button>
        <p className="text-primary text-lg italic">Rules : {card.rules}</p>
      </div>
    </>
  );
}

export default EventDetails;
