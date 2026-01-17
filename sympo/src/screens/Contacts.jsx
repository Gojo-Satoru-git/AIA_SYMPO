import { Container, Typography, IconButton } from "@mui/material";
import ContactCard from "../components/contactcard";
import RegistrationCard from "../components/RegContactCard";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useEffect, useRef, useState } from "react";
const events = [{ eventName: "Hackathon",category: "technical", coordinators: [{ name: "Sandeep", phone: "9884793806" }, { name: "Rahul ", phone: "9159812736" },], }, { eventName: "workshop2",category: "technical", coordinators: [{ name: "Kamalnath", phone: "9150580147" }, { name: "Albin Joseph ", phone: "9566322365" },], }, { eventName: "Workshop1",category: "technical", coordinators: [{ name: "Dipakumar", phone: "7639933600" }, { name: "Ramkumar", phone: "8825538554" },], }, { eventName: "Poster Presentation",category: "technical", coordinators: [{ name: "Poorna Prakash ", phone: " 8838730894" }, { name: "Madhubala ", phone: "9345778968 " },], }, { eventName: "Ninja Coding",category: "technical", coordinators: [{ name: "Mekesh", phone: " 9952598472 " }, { name: "Rasheen fahmi", phone: "7867896416" },], }, { eventName: "Call of Query",category: "technical", coordinators: [{ name: "Surya", phone: "8148124727" }, { name: "Jayasree", phone: "8072064228" },], }, { eventName: "Coding with AI",category: "technical", coordinators: [{ name: "SriLakshmi", phone: "9566208249" }, { name: "Rakshitha", phone: "8610209696" },], }, { eventName: "Tournament of Strategies",category: "technical", coordinators: [{ name: "Chandru", phone: "7667634519" }, { name: "Mirsha", phone: "9940358967" },], }, { eventName: "TREASURE HUNT",category: "non-technical", coordinators: [{ name: "Jhanavi", phone: "9384654366" }, { name: "Jessica", phone: "6385033919" },], }, { eventName: "CONNEXTIONS",category: "non-technical", coordinators: [{ name: "Karthikeyan", phone: "8825535520" }, { name: "Ithikash", phone: "9786398639" },], }, { eventName: "FANDOM QUIZ",category: "non-technical", coordinators: [{ name: "Pragadeeshwaran", phone: "8903098801" }, { name: "Ganesh", phone: "7339532544" },], }, { eventName: "IPL AUCTION",category: "non-technical", coordinators: [{ name: "Abinash", phone: "6383467363" }, { name: "Joel", phone: "6381165383" },], }, { eventName: "ADZAP",category: "non-technical", coordinators: [{ name: "Sudhahar", phone: "9363595133" }, { name: "PrithiviRaj", phone: "9042781374" },], }];



const Contacts = () => {
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [Selected, SetSelected] = useState("All");



  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }
}, [Selected]);



  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };
  const filteredEvents =
    Selected === "All"
      ? events
      : events.filter(
        (event) =>
          event.category?.toLowerCase() === Selected.toLowerCase()
      );

  return (
    <div id="contacts" className="  pt-[15px] -mt-[100px]">
      <Container maxWidth="lg" className="mt-12 px-4 sm:px-6" >
    <div className="py-10">

        {/* ================= EVENT COORDINATORS ================= */}
        <Typography
          variant="h4"
          className="text-red-600 text-center font-bold tracking-widest mb-6"
          sx={{ fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" } }}
        >
          EVENT COORDINATORS
        </Typography>
        <Typography
  className="text-gray-400 text-center mb-4"
  sx={{
    fontSize: "0.85rem",
    display: { xs: "block", md: "none" }, // 👈 mobile only
  }}
>
  Swipe left or right to view coordinators →
</Typography>

       {/* ================= FILTER BUTTONS (FIXED) ================= */}
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


        <div className="relative scroll-hint">

          {/* LEFT ARROW (DESKTOP ONLY) */}
          <IconButton
            onClick={scrollLeft}
            sx={{
              m:0.5,
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: -24,
              top: "50%",
              transform: "translateY(-50%)",
              color: "red",
              backgroundColor: "#0b0b0b",
              border: "1px solid red",
              zIndex: 10,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
         
            className={`
              flex gap-6
              overflow-x-auto
              pb-6
              hide-scrollbar
              px-4 sm:px-6 md:px-0 py-2
              ${isMobile && isScrolling ? "no-anim" : ""}
            `}
            style={{
              WebkitOverflowScrolling: "touch",
              
               
            }}
          >
            {filteredEvents.map((event, index) => (
              <ContactCard
                key={index}
                eventName={event.eventName}
                coordinators={event.coordinators}
              />
            ))}

          </div>

          {/* RIGHT ARROW (DESKTOP ONLY) */}
          <IconButton
            onClick={scrollRight}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              right: -24,
              top: "50%",
              transform: "translateY(-50%)",
              color: "red",
              backgroundColor: "#0b0b0b",
              border: "1px solid red",
              zIndex: 10,
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>

        {/* ================= REGISTRATION ENQUIRIES ================= */}
        <Typography
          variant="h4"
          className="text-red-600 text-center font-bold tracking-widest mb-6"
          sx={{ fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" } }}
        >
          REGISTRATION ENQUIRIES
        </Typography>
        <Typography
  className="text-gray-400 text-center mb-6 "
  sx={{
    fontSize: "0.85rem",

    display: { xs: "block", md: "none" },
  }}
>
  Swipe left or right to view registration contacts →
</Typography>
        <div className="relative scroll-hint">
        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-4 py-2.5 md:justify-center">
          <RegistrationCard position="Registration Lead" name="Karthik M" phone="9876543210" />
          <RegistrationCard position="Registration Co-Lead" name="Anitha P" phone="9123456789" />
          <RegistrationCard position="Help Desk" name="Rahul S" phone="9988776655" />
        </div>
       </div>
        
      </div>
      </Container>
    </div>
  );
};

export default Contacts;
