import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const RegistrationCard = ({ position, name, phone }) => {
  return (
    <Card
      className="
        glow-red
        transition-transform duration-300
        hover:scale-105
        flex-shrink-0
        snap-center
      "
      sx={{
        backgroundColor: "#0b0b0b",
        borderRadius: "16px",
        width: {
          xs: 220,
          sm: 260,
          md: 280,
        },
        minHeight: 160,
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ width: "100%", textAlign: "center" }}>
        {/* POSITION */}
        <Typography
          variant="subtitle1"
          className="text-red-600 font-bold tracking-wider mb-2"
        >
          {position}
        </Typography>

        {/* NAME */}
        <Typography className="text-white font-semibold mb-2">
          {name}
        </Typography>

        {/* PHONE */}
        <Box className="flex items-center justify-center gap-2">
          <LocalPhoneIcon className="text-red-600 text-sm" />
          <Typography className="text-gray-400 text-sm">
            {phone}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegistrationCard;
