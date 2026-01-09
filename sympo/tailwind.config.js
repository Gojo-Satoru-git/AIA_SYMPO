/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
       fontFamily: {
        stranger: ['"StrangerThings"', 'serif'],
      },
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
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 24%, 55%': { opacity: '0.4' },
        },
        zoom: {
          "0%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        
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
      },

      animation: {
        "fade-in-down": "fadeInDown 0.8s ease-in-out",
        flicker: "flicker 2s infinite",
       
        zoom: "zoom 2.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
