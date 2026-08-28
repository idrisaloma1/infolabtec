/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          paper: "#f8f9f6",   // page background — warm off-white
          mist: "#eef2ee",    // subtle green-tinted panel background
          ink: "#22322f",     // primary body text — dark slate-green
          green: {
            50: "#eef4f1",
            100: "#d8e6e0",
            300: "#8fb3a5",
            400: "#5f8f7c",
            500: "#3d6b56",
            600: "#2f5443",
            700: "#233f33",
          },
          red: {
            50: "#fbeceb",
            100: "#f3cfcb",
            300: "#e08a80",
            400: "#cc5a4d",
            500: "#b3362a",
            600: "#8f2b21",
          },
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 15% 15%, rgba(61,107,86,0.10), transparent 42%), radial-gradient(circle at 85% 0%, rgba(179,54,42,0.08), transparent 45%), linear-gradient(180deg, #f8f9f6 0%, #f2f5f1 55%, #eef2ee 100%)",
        "ict-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%232f5443' stroke-opacity='0.06' stroke-width='1.4'%3E%3Cpath d='M10 10h30v30h30v-20h40'/%3E%3Cpath d='M0 60h20v40h50v-25h50'/%3E%3Ccircle cx='40' cy='10' r='3'/%3E%3Ccircle cx='80' cy='20' r='3'/%3E%3Ccircle cx='20' cy='100' r='3'/%3E%3Ccircle cx='70' cy='75' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
