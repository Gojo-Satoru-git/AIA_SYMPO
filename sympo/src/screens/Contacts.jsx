import { Container, Typography } from "@mui/material";
import ContactCard from "../components/contactcard";
import RegistrationCard from "../components/RegContactCard";


const Contacts = () => {
  return (
    <Container
      maxWidth="lg"
      className="bg-black mt-12 px-4 sm:px-6"
    >
      {/* ================= EVENT COORDINATORS ================= */}
      <Typography
  variant="h4"
  className="
    text-red-600 text-center
    font-bold tracking-widest
    mb-6
  "
  sx={{
    fontSize: {
      xs: "1.4rem",   // 📱 mobile
      sm: "1.8rem",   // 📱 tablet
      md: "2.2rem",   // 💻 desktop
    },
  }}
>
  EVENT COORDINATORS
</Typography>


      {/* Responsive Scroll Container */}
      <div
        className="
    flex gap-6
    overflow-x-auto
    pb-6
    scroll-smooth
    hide-scrollbar

    px-4 md:px-0

    justify-start
    md:justify-start

    snap-x
    md:snap-none
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

      {/* ================= REGISTRATION ENQUIRIES ================= */}
      <Typography
  variant="h4"
  className="
    text-red-600 text-center
    font-bold tracking-widest
    mb-6
  "
  sx={{
    fontSize: {
      xs: "1.4rem",   // 📱 mobile
      sm: "1.8rem",   // 📱 tablet
      md: "2.2rem",   // 💻 desktop
    },
  }}
>
  REGISTRATION ENQUIRIES
</Typography>


      {/* EXACTLY 3 CARDS */}
      <div
       className="
    flex gap-6
    overflow-x-auto
    pb-6
    scroll-smooth
    hide-scrollbar

    px-4
    md:px-0

    justify-start
    md:justify-center

    snap-x
    md:snap-none
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
  );
};

export default Contacts;
