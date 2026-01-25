import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useToast from "../context/useToast";
import { updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const menuItemStyle = {
  color: "#e5e5e5",
  fontSize: "0.95rem",
  fontWeight: 500,
  padding: "12px 18px",
  borderRadius: "8px",
  margin: "4px 6px",
  "&:hover": {
    backgroundColor: "rgba(229,9,20,0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "#e50914",
    color: "white",
    fontWeight: 600,
  },
};

const menuPaperStyle = {
  backgroundColor: "#0b0b0b",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
};

/* ================= INPUT STYLE ================= */

const inputStyle = {
  input: {
    color: "white",
  },

  label: {
    color: "#b0b0b0",
    fontWeight: 500,
  },

  "& label.Mui-focused": {
    color: "#e50914", // 🔥 red instead of blue
  },

  "& label .MuiFormLabel-asterisk": {
    color: "#e50914", // 🔥 required *
  },

  "& .MuiOutlinedInput-root": {
    backgroundColor: "#0b0b0b",
    borderRadius: "12px",

    "& fieldset": {
      borderColor: "#444",
    },

    "&:hover fieldset": {
      borderColor: "#e50914",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#e50914",
      boxShadow: "0 0 8px rgba(229,9,20,0.6)",
    },
  },
};


/* ================= COMPONENT ================= */

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [passValid, setPassValid] = useState({
    upper: false, lower: false, num: false, special: false, length: false
  });
  
  const [match, setMatch] = useState(false);
  
  useEffect(() => {
    setPassValid({
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      num: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      length: password.length >= 8
    });
    setMatch(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      setLoading(true);

      if (mode === "signup") {
        if(!Object.values(passValid).every(Boolean)){
          showToast("Password does not meet requirements", "error");
          setLoading(false);
          return;         
        }

        if (!match) {
          showToast("Passwords do not match", "error");
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        await updateProfile(cred.user, {
          displayName: data.name,
        });

        const token = await cred.user.getIdToken();

        await registerUser({
          uid: cred.user.uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          institute: data.institute,
          year: year,
        }, token);

        localStorage.setItem("authToken", token);

        showToast("Account created successfully", "success");
        navigate("/", { replace: true });
      }

      if (mode === "signin") {
        const cred = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const token = await cred.user.getIdToken();
        localStorage.setItem("authToken", token);

        showToast("Login successful", "success");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Something went wrong", "error");    
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ valid, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      {valid ? 
        <CheckCircleIcon sx={{ color: '#e50914', fontSize: 16 }} /> : 
        <CancelIcon sx={{ color: '#333', fontSize: 16 }} />
      }
      <Typography sx={{ 
        color: valid ? '#ffffff' : '#555', 
        fontSize: '0.75rem', 
        letterSpacing: "1px",
        fontFamily: "StrangerRegular",
        transition: 'all 0.3s ease' 
      }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* ================= SIGN UP ================= */}
      {mode === "signup" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <div className="grid grid-cols-1 sm:col-span-2">
            <TextField name="name" label="Full Name" required sx={inputStyle} />
          </div>

          {/* INSTITUTE */}
          <div className="sm:col-span-2">
            <TextField name="institute" label="Institute Name" required fullWidth sx={inputStyle} />
          </div>

          {/* PHONE */}
          <TextField name="phone" label="Phone Number" type="tel" required sx={inputStyle} />
           
          {/* YEAR */}
          <TextField
            select
            name="year"
            label="Year of Study"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{
              ...inputStyle,
              "& .MuiSelect-select": { color: "white" },
              "& .MuiSelect-icon": { color: "#e50914" },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: menuPaperStyle,
                },
              },
            }}
          >
            <MenuItem value="1" sx={menuItemStyle}>1st Year</MenuItem>
            <MenuItem value="2" sx={menuItemStyle}>2nd Year</MenuItem>
            <MenuItem value="3" sx={menuItemStyle}>3rd Year</MenuItem>
            <MenuItem value="4" sx={menuItemStyle}>4th Year</MenuItem>
          </TextField>

          {/* EMAIL */}
          <div className="sm:col-span-2">
            <TextField name="email" label="Email" type="email" required fullWidth sx={inputStyle} />
          </div>
        </div>
      )}

      {/* ================= SIGN IN ================= */}
      {mode === "signin" && (
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          sx={inputStyle}
        />
      )}

      {/* PASSWORD */}
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        sx={inputStyle}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />

      {/* PASSWORD STRENGTH INDICATOR (Only on Signup) */}
      {mode === "signup" && (passwordFocused || password.length > 0) && (
        <Box sx={{ 
          p: 2,
          bgcolor: 'rgba(229,9,20,0.05)',
          borderRadius: "14px",
          border: `1px solid rgba(229,9,20,0.4)`,
          backdropFilter: "blur(6px)",
          boxShadow: `
            0 0 20px rgba(229,9,20,0.35),
            inset 0 0 25px rgba(229,9,20,0.2)
          `,
          transition: "all 0.3s ease",
          animation: "fadeIn 0.2s ease-in-out"
        }}>
          <div className="grid grid-cols-2 gap-x-4">
            <ValidationItem valid={passValid.length} text="Min 8 Characters" />
            <ValidationItem valid={passValid.upper} text="1 Uppercase (A-Z)" />
            <ValidationItem valid={passValid.lower} text="1 Lowercase (a-z)" />
            <ValidationItem valid={passValid.num} text="1 Number (0-9)" />
            <ValidationItem valid={passValid.special} text="1 Special (!@#...)" />
          </div>
        </Box>
      )}

      {/* CONFIRM PASSWORD */}
      {mode === "signup" && (
        <div className="flex flex-col gap-2">
            <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                sx={inputStyle}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
              {/* MATCH INDICATOR */}
              {confirmPassword && (
              <Typography sx={{
                fontSize: "0.8rem",
                color: match ? "#e50914" : "#555",
                letterSpacing: "1px",
                transition: "all 0.3s ease"
              }}>
                {match ? "Passwords Match" : "Passwords do not match"}
              </Typography>
            )}
        </div>
      )}

      {/* ================= SUBMIT ================= */}
      <Button
  type="submit"
  fullWidth
  disabled={loading || (mode === "signup" && (!match || !Object.values(passValid).every(Boolean)))}
  sx={{
    mt: 2,
    py: 1.4,
    backgroundColor: "#e50914",
    color: "white",
    fontWeight: 700,
    letterSpacing: "0.2em",
    borderRadius: "999px",
    boxShadow: `0 0 20px #e50914`,
    "&.Mui-disabled": {
      backgroundColor: "#555",
      color: "#aaa",
    },
    "&:hover": {
      backgroundColor: "#ff1a1a",
      boxShadow: `0 0 30px #e50914`,
      transform: "scale(1.03)",
    },
    transition: "all 0.25s ease",
  }}
>
    { loading ? (
      <span className="flex items-center justify-center gap-2">
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        PROCESSING...
      </span>
    ) : mode === "signin" ? (
      "SIGN IN"
    ) : (
      "CREATE ACCOUNT"
    )}

</Button>

    </form>
  );
};

export default AuthForm;
