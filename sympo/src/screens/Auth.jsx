import { Container, Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AuthForm from "../components/Authform";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = ({ mode: initialMode }) => {
  const [mode, setMode] = useState(initialMode || "signin"); // signin | signup
const navigate = useNavigate();
 useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Container maxWidth="sm">
        <Box className="bg-[#0b0b0b] p-6 sm:p-8 rounded-2xl glow-red">
           <Button
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate("/")}
  sx={{
    color: "#ccc",
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    mb: 2,
    alignSelf: "flex-start",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(255,255,255,0.05)",
    },
  }}
>
  Back
</Button>

        <Typography variant="h4"  className="text-red-600 text-center font-bold tracking-widest mb-6 p-2">Symposium'26</Typography>
          {/* TITLE */}
          <Typography
            variant="h5"
            className="text-red-600 text-center font-bold tracking-widest mb-6"
          >
            {mode === "signin" ? "SIGN IN" : "SIGN UP"}
          </Typography>

          {/* FORM */}
          <AuthForm mode={mode} />

          {/* TOGGLE */}
         <p className="text-gray-400 text-center mt-4 text-sm">
  {mode === "signin" ? "Don’t have an account?" : "Already have an account?"}
  <span
    className="text-red-600 cursor-pointer ml-2"
    onClick={() =>
      navigate(mode === "signin" ? "/signup" : "/signin")
    }
  >
    {mode === "signin" ? "Sign Up" : "Sign In"}
  </span>
</p>

        </Box>
      </Container>
    </div>
  );
};

export default Auth;
