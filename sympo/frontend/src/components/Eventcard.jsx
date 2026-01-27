/* eslint-disable no-unused-vars */
import {useState , useEffect , useRef} from 'react';

function Eventcard({ title, desc, image, date, time, index, category, backside, onClick }) {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [Flipped, setFlipped] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    setHasAppeared(false);
    setFlipped(true);
  }, [category, title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Use the first entry (index 0)
        if (entries[0].isIntersecting) {
          setHasAppeared(true);
        } else {
          setHasAppeared(false);
          setFlipped(true);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasAppeared) {
      const delay = index * 200;
      const timer = setTimeout(() => {
        setFlipped(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [hasAppeared, index]);
  const sizeClasses =
    category === 'workshop'
      ? 'w-[70vw] sm:w-72 h-96' // Larger for workshops
      : 'w-[70vw] sm:w-72 h-96';

  return (
    <div ref={cardRef} className={`perspective flex-shrink-0 ${sizeClasses}  m-2 sm:m-1`}>
      <div
        className={`relative w-full h-full transition-transform duration-1000 preserve-3d ${
          Flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
        }`}
      >
        {/* FRONT FACE (Needs backface-hidden to swap correctly) */}
        <div
          onClick={onClick}
          className="absolute inset-0 w-full h-full backface-hidden rounded-md shadow-stGlow bg-black border-4 border-primary flex flex-col items-center cursor-pointer"
        >
          <img src={image} alt={title} className="w-full h-full object-cover mx-auto" />
          <div className="flex-shrink-0 w-full">
            <p className="text-primary text-center p-2 mt-1 text-sm font-bold">
              {date} · {time}
            </p>
          </div>
        </div>

        {/* BACK FACE (Pre-rotated to face away) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-primary rounded-md flex items-center justify-center [transform:rotateY(180deg)]">
          <img src={backside} className="w-full h-full overflow-hidden m-4"></img>
        </div>
      </div>
    </div>
  );
}

export default Eventcard;
