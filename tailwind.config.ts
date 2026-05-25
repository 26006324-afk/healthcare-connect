import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mint: {
          50: "#eefcf8",
          100: "#d7f7ef",
          500: "#2fbf9a",
          700: "#147d68"
        },
        skycare: {
          50: "#eef8ff",
          100: "#d9efff",
          500: "#55a9e8",
          700: "#1f6da8"
        },
        lavender: {
          50: "#f7f3ff",
          100: "#ede5ff",
          500: "#9077e8"
        },
        coral: {
          50: "#fff4f1",
          500: "#f37f68"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(44, 92, 123, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
