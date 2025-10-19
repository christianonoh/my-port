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
        dark: "rgb(24 24 27)",
        light: "rgb(255 255 255)",
        accent: "rgb(182, 140, 255)",
        gray: "rgb(161 161 170)",
        "gray-dark": "rgb(63 63 70)",
        "gray-light": "rgb(228 228 231)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
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
