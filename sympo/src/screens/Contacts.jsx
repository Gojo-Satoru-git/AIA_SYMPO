import { Container, Typography, IconButton } from "@mui/material";
import ContactCard from "../components/contactcard";
import RegistrationCard from "../components/RegContactCard";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useEffect, useRef, useState } from "react";

const Contacts = () => {
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  return () => window.removeEventListener("resize", checkMobile);
}, []);


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

  return (
    <div className="bg-black">
      <Container maxWidth="lg" className="mt-12 px-4 sm:px-6">

        {/* ================= EVENT COORDINATORS ================= */}
        <Typography
          variant="h4"
          className="text-red-600 text-center font-bold tracking-widest mb-6"
          sx={{ fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" } }}
        >
          EVENT COORDINATORS
        </Typography>

        <div className="relative">

          {/* LEFT ARROW (DESKTOP ONLY) */}
          <IconButton
            onClick={scrollLeft}
            sx={{
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
              scrollBehavior: "auto", // 🔥 critical for mobile
            }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <ContactCard
                key={i}
                eventName="Ideathon"
                coordinators={[
                  { name: "Anita P", phone: "9876501234" },
                  { name: "Karthik M", phone: "9123405678" },
                ]}
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

        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-4 py-2.5 md:justify-center">
          <RegistrationCard position="Registration Lead" name="Karthik M" phone="9876543210" />
          <RegistrationCard position="Registration Co-Lead" name="Anitha P" phone="9123456789" />
          <RegistrationCard position="Help Desk" name="Rahul S" phone="9988776655" />
        </div>

      </Container>
    </div>
  );
};

export default Contacts;
