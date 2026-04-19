import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}", // ⚠️ IMPORTANT (you missed this)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;