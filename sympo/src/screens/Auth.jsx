import { Container, Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AuthForm from "../components/Authform";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = ({ mode: initialMode }) => {
  const [mode, setMode] = useState(initialMode || "signin");
  const navigate = useNavigate();

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  return (
    <div className="min-h-screen  flex items-center justify-center px-2 sm:px-4">
      <Container
        maxWidth="sm"
        sx={{
          px: { xs: 1, sm: 2 },
          zIndex:1,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#0b0b0b",
            p: { xs: 3, sm: 4 },
            borderRadius: "20px",
            boxShadow: `
              0 0 25px rgba(229,9,20,0.4),
              inset 0 0 10px rgba(255,255,255,0.04)
            `,
          }}
        >
          {/* TOP BAR */}
          
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{
                color: "#ccc",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                "&:hover": {
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Back
            </Button>

            <Typography
  sx={{
    color: "#e50914",
    fontWeight: 800,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    fontSize: {
      xs: "1.3rem",   // mobile
      sm: "1.6rem",   // tablet
      md: "1.9rem",   // desktop
    },
    mb: 1,
  }}
  className="text-center"
>
  SYMPOSIUM'26
</Typography>

         

          {/* TITLE */}
          <Typography
            sx={{
              color: "#e50914",
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: "0.3em",
              mb: 3,
              fontSize: {
                xs: "1.1rem",
                sm: "1.3rem",
                md: "1.5rem",
              },
            }}
          >
            {mode === "signin" ? "SIGN IN" : "SIGN UP"}
          </Typography>

          {/* FORM */}
          <AuthForm mode={mode} />

          {/* TOGGLE */}
          <p
            style={{
              color: "#aaa",
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.8rem",
            }}
          >
            {mode === "signin"
              ? "Don’t have an account?"
              : "Already have an account?"}
            <span
              onClick={() =>
                navigate(mode === "signin" ? "/signup" : "/signin")
              }
              style={{
                color: "#e50914",
                cursor: "pointer",
                marginLeft: "8px",
                fontWeight: 600,
                letterSpacing: "0.12em",
              }}
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
