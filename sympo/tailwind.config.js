/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E50914",       
        dark: "#0B0B0B",          
        darkCard: "#111111",
      },

      boxShadow: {
        stGlow: "0 0 20px rgba(229,9,20,0.6)",
        stGlowStrong: "0 0 30px rgba(229,9,20,0.9)",
      },

      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-20%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },

      animation: {
        "fade-in-down": "fadeInDown 0.8s ease-in-out",
        flicker: "flicker 2.5s infinite",
      },
    },
  },
  plugins: [],
};
