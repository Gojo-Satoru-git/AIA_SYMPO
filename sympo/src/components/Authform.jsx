import { TextField, Button, MenuItem } from "@mui/material";
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
    backgroundColor: "rgba(229,9,20,0.9)",
    color:"white",  
    fontWeight: 600,
  },

  "&.Mui-selected:hover": {
    backgroundColor: "#e50914",
  },
};

const menuPaperStyle = {
  backgroundColor: "#0b0b0b",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  marginTop: "6px",
  boxShadow: `
    0 0 12px rgba(229,9,20,0.35),
    inset 0 0 8px rgba(255,255,255,0.03)
  `,
};


const AuthForm = ({ mode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(Object.fromEntries(data.entries()));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* ================= SIGN UP ================= */}
      {mode === "signup" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* FULL NAME */}
          <div className=" grid grid-col-1 sm:col-span-2">
          <TextField
            name="name"
            label="Full Name"
            required
            sx={inputStyle}
          />
          </div>

          {/* YEAR */}
         

          {/* INSTITUTE NAME — FULL WIDTH */}
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
           <TextField
  select
  name="year"
  label="Year of Study"
  required
  sx={{
    ...inputStyle,
     "& .MuiSelect-select": {
      color: "white",        // ✅ FIXES invisible text
    },
    "& .MuiSelect-icon": {
      color: "#e50914", 
    },
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


          {/* EMAIL — FULL WIDTH */}
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

      {/* ================= PASSWORDS ================= */}
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        sx={inputStyle}
      />

      {mode === "signup" && (
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
          sx={inputStyle}
        />
      )}

      {/* ================= SUBMIT ================= */}
      <Button
  type="submit"
  fullWidth
  sx={{
    mt: 2,
    py: 1.4,
    backgroundColor: "#e50914",
    color: "white",
    fontWeight: 700,
    letterSpacing: "0.2em",
    borderRadius: "999px",
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
  {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
</Button>

    </form>
  );
};

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

export default AuthForm;
