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
