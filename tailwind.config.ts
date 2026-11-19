import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        slate: {
          25: "#fcfcfd",
        },
        brand: {
          50: "#f4f3ff",
          100: "#ebe9fe",
          500: "#7f56d9",
          600: "#6941c6",
          700: "#53389e",
        },
        cyan: {
          50: "#ecfdff",
          100: "#cff9fe",
          500: "#06b6d4",
        },
      },
      boxShadow: {
        soft: "0 18px 55px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
