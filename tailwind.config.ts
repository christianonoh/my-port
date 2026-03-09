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
        "accent-dark": "#5B21B6",
        "accent-light": "#E9D5FF",
        "accent-glow": "rgba(109,40,217,0.18)",
        dark: "#0E0E13",
        light: "#FAF9FD",
        accent: "#6D28D9",
        gray: "#71717A",
        "gray-dark": "#27272F",
        "gray-light": "#D6D3E1",
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
        "accent-glow": "0 0 20px rgba(167,139,250,0.3)",
        "accent-glow-lg": "0 0 40px rgba(167,139,250,0.4)",
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
