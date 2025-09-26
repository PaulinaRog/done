/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#f5f5f5"
        },
        txt: {
          light: "#333",
          dark: "#eaeaea",
        },
        acc: {
          light: "#23cf9d"
        },
        secondary: {
          light: "#D4D4D4"
        },
        shdw: {
          light: "#7D7D7D",
          dark: "black"
        },
        nav: { 
          dark: "#000000"
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.08)",
      },
    },
    container: {
      center: true,
      padding: "2rem",
    },
    typography: (theme) => ({
      DEFAULT: {
        css: {
          h2: {
            // Add your h2 styles here
            fontSize: theme("fontSize.2xl"),
            fontWeight: theme("fontWeight.semibold"),
            marginBottom: theme("margin.4"),
          },
          p: {
            // Add your p styles here
            fontSize: theme("fontSize.base"),
            marginBottom: theme("margin.4"),
          },
          img: {
            width: "100%",
            marginBottom: "40px",
          },
        },
      },
    }),
  },
  variants: {
    extend: {
      backgroundColor: ["dark"],
      textColor: ["dark"],
    },
  },

  plugins: [typography],
};
