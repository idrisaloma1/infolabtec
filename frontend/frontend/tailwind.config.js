/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050b18",
          900: "#0a1229",
          800: "#0f1b3d",
          700: "#152452",
        },
        electric: {
          500: "#2563eb",
          400: "#3b82f6",
        },
        cyan: {
          400: "#22d3ee",
          300: "#67e8f9",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.25), transparent 45%), linear-gradient(180deg, #050b18 0%, #0a1229 60%, #0f1b3d 100%)",
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
