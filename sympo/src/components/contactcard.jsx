import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const ContactCard = ({ eventName, coordinators }) => {
  return (
    <Card
      className="
      animated-border
        glow-red
        transition-transform duration-300
        hover:scale-105
        flex-shrink-0
        snap-center
        mx-2.5
      "
      sx={{
        backgroundColor: "#0b0b0b",
        borderRadius: "16px",
        width: {
          xs: 250,   // 📱 mobile
          sm: 270,   // 📱 tablet
          md: 290,   // 💻 desktop
        },
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* EVENT NAME */}
        <Typography
          variant="h6"
          className="text-red-600 text-center"
          sx={{ wordBreak: "break-word" }}
        >
          {eventName}
        </Typography>

        {/* COORDINATORS */}
        {coordinators.map((coord, index) => (
          <Box
            key={index}
            className="flex flex-col items-center mt-2"
          >
            <Typography className="text-white font-semibold text-center">
              {coord.name}
            </Typography>

            <Box className="flex items-center justify-center gap-2 mt-1">
              <LocalPhoneIcon className="text-red-600 text-sm" />
              <Typography className="text-gray-400 text-sm">
                {coord.phone}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContactCard;
