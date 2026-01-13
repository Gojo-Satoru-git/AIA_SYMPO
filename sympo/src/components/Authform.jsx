import { TextField, Button, MenuItem } from "@mui/material";

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { registerUser, getProfile } from "../services/auth.service";

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
  input: { color: "white" },
  label: { color: "#aaa" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#0b0b0b",
    borderRadius: "12px",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#e50914" },
    "&.Mui-focused fieldset": { borderColor: "#e50914" },
  },
};

/* ================= COMPONENT ================= */

const AuthForm = ({ mode }) => {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      setLoading(true);

      if (mode === "signup") {
        if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match");
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


        await registerUser({
          uid: cred.user.uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          institute: data.institute,
          year: data.year,
        });

        toast.success("Account created successfully 🎉");
        navigate("/", { replace: true });
      }

      if (mode === "signin") {
        const cred = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        
        const token = await cred.user.getIdToken();
        await getProfile(token);

        toast.success("Login successful ✅");
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


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
            <TextField
              name="institute"
              label="Institute Name"
              required
              fullWidth
              sx={inputStyle}
            />
          </div>

          {/* PHONE */}
          <TextField
            name="phone"
            label="Phone Number"
            type="tel"
            required
            sx={inputStyle}
          />
           

          {/* YEAR */}
          <TextField
            select
            name="year"
            label="Year of Study"
            required
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
            <MenuItem value="1" sx={menuItemStyle}>
              1st Year
            </MenuItem>
            <MenuItem value="2" sx={menuItemStyle}>
              2nd Year
            </MenuItem>
            <MenuItem value="3" sx={menuItemStyle}>
              3rd Year
            </MenuItem>
            <MenuItem value="4" sx={menuItemStyle}>
              4th Year
            </MenuItem>
          </TextField>

          {/* EMAIL */}
          <div className="sm:col-span-2">
            <TextField
              name="email"
              label="Email"
              type="email"
              required
              fullWidth
              sx={inputStyle}
            />
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
      />

      {/* CONFIRM PASSWORD */}
      {mode === "signup" && (
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
          sx={inputStyle}
        />
      )}

      {message && (
        <p className="text-green-400 text-sm text-center">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">
          {error}
        </p>
      )}

      {/* ================= SUBMIT ================= */}
      <Button
  type="submit"
  fullWidth
  disabled={loading}
  sx={{
    mt: 2,
    py: 1.4,
    backgroundColor: "#e50914",
    color: "white",
    fontWeight: 700,
    letterSpacing: "0.2em",
    borderRadius: "999px",
    "&.Mui-disabled": {
      backgroundColor: "#555",
      color: "#aaa",
    },
    boxShadow: `
      0 0 12px rgba(229,9,20,0.8),
      inset 0 0 8px rgba(255,255,255,0.15)
    `,
    "&:hover": {
      backgroundColor: "#ff1a1a",
      boxShadow: `
        0 0 20px rgba(229,9,20,1),
        inset 0 0 10px rgba(255,255,255,0.25)
      `,
      transform: "scale(1.03)",
    },
    transition: "all 0.25s ease",
  }}
>
    { loading ? (
      <span className="flex items-center justify-center gap-2">
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        PROCESSING
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
