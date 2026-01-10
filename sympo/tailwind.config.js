/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        stranger: ['"StrangerThings"', 'serif'],
        strange: ['"StrangerRegular"', 'serif'],
      },
      colors: {
        primary: '#E50914',
        dark: '#0B0B0B',
        darkCard: '#111111',
      },

      boxShadow: {
        stGlow: '0 0 20px rgba(229,9,20,0.6)',
        stGlowStrong: '0 0 30px rgba(229,9,20,0.9)',
      },

      keyframes: {
        'slide-down': {
        '0%': { transform: 'translateY(-100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 24%, 55%': { opacity: '0.4' },
        },
        flip: {
          '0%': { transform: 'rotateZ(45deg)' },
          '100%': { transform: 'rotateZ(0deg)' },
        },
        popup: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '1' },
        },
        zoomIn: {
          '0%': {
            transform: 'scale(5)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },

        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },

      animation: {
        "fade-in-down": "fadeInDown 0.8s ease-in-out",
        flicker: "flicker 2s infinite",
       'slide-down': 'slide-down 1s ease-out forwards',
        zoom: "zoomIn 1.8s ease-out forwards",
      },
         transitionDelay: {
      100: '100ms',
      200: '200ms',
      300: '300ms',
      400: '400ms',
      500: '500ms',
    },
    },
  },
  plugins: [],
};
