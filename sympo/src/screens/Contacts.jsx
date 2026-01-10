import { Container, Typography, IconButton } from "@mui/material";
import ContactCard from "../components/contactcard";
import RegistrationCard from "../components/RegContactCard";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useRef } from "react";

const Contacts = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-black">
      <Container maxWidth="lg" className="mt-12 px-4 sm:px-6">

        {/* ================= EVENT COORDINATORS ================= */}
        <Typography
          variant="h4"
          className="text-red-600 text-center font-bold tracking-widest mb-6"
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
            padding: "0.5rem",
          }}
        >
          EVENT COORDINATORS
        </Typography>

        {/* ===== Scroll Section with Arrows ===== */}
        <div className="relative">

          {/* LEFT ARROW */}
          <IconButton
            onClick={scrollLeft}
            className="hidden md:flex"
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
              "&:hover": {
                backgroundColor: "#140000",
              },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="
              flex gap-6
              overflow-x-auto
              pb-6
              scroll-smooth
              hide-scrollbar
              rounded-lg
              px-4 sm:px-6 md:px-0
              py-2
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ContactCard
              eventName="Paper Presentation"
              coordinators={[
                { name: "Arjun Kumar", phone: "9876543210" },
                { name: "Sneha R", phone: "9123456780" },
              ]}
            />

            <ContactCard
              eventName="Hackathon"
              coordinators={[
                { name: "Rahul S", phone: "9988776655" },
                { name: "Divya M", phone: "8899776655" },
              ]}
            />

            <ContactCard
              eventName="Ideathon"
              coordinators={[
                { name: "Anita P", phone: "9876501234" },
                { name: "Karthik M", phone: "9123405678" },
              ]}
            />

            <ContactCard
              eventName="Ideathon"
              coordinators={[
                { name: "Anita P", phone: "9876501234" },
                { name: "Karthik M", phone: "9123405678" },
              ]}
            />

            <ContactCard
              eventName="Ideathon"
              coordinators={[
                { name: "Anita P", phone: "9876501234" },
                { name: "Karthik M", phone: "9123405678" },
              ]}
            />

            <ContactCard
              eventName="Ideathon"
              coordinators={[
                { name: "Anita P", phone: "9876501234" },
                { name: "Karthik M", phone: "9123405678" },
              ]}
            />

            <ContactCard
              eventName="Ideathon"
              coordinators={[
                { name: "Anita P", phone: "9876501234" },
                { name: "Karthik M", phone: "9123405678" },
              ]}
            />
          </div>

          {/* RIGHT ARROW */}
          <IconButton
            onClick={scrollRight}
            className="hidden md:flex"
            sx={{
              position: "absolute",
              display: { xs: "none", md: "flex" },
              right: -24,
              top: "50%",
              transform: "translateY(-50%)",
              color: "red",
              backgroundColor: "#0b0b0b",
              border: "1px solid red",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "#140000",
              },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

        </div>

        {/* ================= REGISTRATION ENQUIRIES ================= */}
        <Typography
          variant="h4"
          className="text-red-600 text-center font-bold tracking-widest mb-6"
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
            padding: "0.5rem",
          }}
        >
          REGISTRATION ENQUIRIES
        </Typography>

        <div
          className="
            flex gap-6
            overflow-x-auto
            pb-6
            hide-scrollbar
            rounded-md
            px-4
            py-2.5

            justify-start
            md:justify-center
          "
        >
          <RegistrationCard
            position="Registration Lead"
            name="Karthik M"
            phone="9876543210"
          />

          <RegistrationCard
            position="Registration Co-Lead"
            name="Anitha P"
            phone="9123456789"
          />

          <RegistrationCard
            position="Help Desk"
            name="Rahul S"
            phone="9988776655"
          />
        </div>

      </Container>
    </div>
  );
};

export default Contacts;
