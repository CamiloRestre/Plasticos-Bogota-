import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#123f2a",
        brand: "#2f7d4f",
        accent: "#e64d3e",
        mint: "#e8f1eb",
      },
    },
  },
  plugins: [],
};

export default config;
