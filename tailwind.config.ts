import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "accent-dark": "#6d1b89",
        "accent-light": "#d4b8ff",
        "accent-glow": "rgba(182,140,255,0.3)",
        dark: "rgb(24 24 27)",
        light: "rgb(255 255 255)",
        accent: "rgb(182, 140, 255)",
        gray: "rgb(161 161 170)",
        "gray-dark": "rgb(63 63 70)",
        "gray-light": "rgb(228 228 231)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "accent-glow": "0 0 20px rgba(182,140,255,0.3)",
        "accent-glow-lg": "0 0 40px rgba(182,140,255,0.4)",
      },
      fontFamily: {
        rubik: ["var(--font-rubik)"],
        outfit: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
