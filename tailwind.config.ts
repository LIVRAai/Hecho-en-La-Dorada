import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dorado: "#D6A23A",
        magdalena: "#1F6F8B",
        ribera: "#4F7D4A",
        crema: "#F7F1E3",
        tierra: "#6B4F3B",
        suave: "#1F1F1F"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        editorial: "0 24px 70px rgba(31, 31, 31, 0.12)"
      },
      backgroundImage: {
        "river-gradient": "linear-gradient(135deg, #F7F1E3 0%, #fff8e8 45%, #d8eced 100%)"
      }
    }
  },
  plugins: [animate]
};

export default config;
