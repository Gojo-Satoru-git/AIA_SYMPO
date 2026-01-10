import React from 'react';

function Eventcard({ title, desc, img, date, time }) {
  return (
    <>
      <div className="p-4 rounded-md shadow-stGlow m-2 flex-grow animated-border">
        <h1 className="text-primary text-center p-2">{title}</h1>
        <img src={img} alt={title} className="w-64 h-40 object-cover rounded-md mx-auto" />
        <p className="text-primary text-center p-2">
          {date} · {time}
        </p>
        <p className="text-primary text-center p-5">{desc}</p>
      </div>
    </>
  );
}

export default Eventcard;
