module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    screens: {
      tablet: "481px",
      sscreen: "769px",
      lscreen: "1025px",
      xscreen: "1200px",
    },
    fontSize: {
      xs: "0.50rem", 
      sm: "0.625rem", 
      base: "0.75rem", 
      md: "1rem",
      lg: "1.25rem",
      xl: "1.50rem",
      "2xl": "2rem",
      "3xl": "3rem",
      "4xl": "4rem",
    },
    maxWidth: {
      containerSize: "1200px",
    },
    extend: {
      colors: {
        first: "#ffd45f",
        graybackground: "#e5e7eb",
      },
    },
  },
  variants: [
    "responsive",
    "group-hover",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled",
  ],
  plugins: [],
};
