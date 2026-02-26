import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        customXl: "rgba(0, 0, 0, 0.07) 0px 3px 13px 0px",
      },
      colors: {
        primary10: "#0d0e0b",
        primary20: "#2b2b2b",
        primary30: "#696969",
        primary40: "#848484",
        primary50: "#a0a0a0",
        primary60: "#b7b8b6",
        primary70: "#c9cac8",
        primary80: "#eeeeee",
        primary90: "#fcfcfc",
        primary100: "#ffffff",
        secondary10: "#0c1d27",
        secondary20: "#18394e",
        secondary30: "#245675",
        secondary40: "#30739c",
        secondary50: "#3c8fc3",
        secondary60: "#63a6cf",
        secondary70: "#8abcdb",
        secondary80: "#b1d2e7",
        secondary90: "#d8e9f3",
        secondary93: "#e4f0f7",
        secondary96: "#eff6fa",
        secondary97: "#f3f8fb",
        secondary98: "#f7fbfd",
        secondary100: "#ffffff",
        tertiary10: "#2d1e06",
        tertiary20: "#593c0d",
        tertiary30: "#865a13",
        tertiary40: "#b37819",
        tertiary50: "#df9620",
        tertiary60: "#e6ab4c",
        tertiary70: "#ecc079",
        tertiary80: "#f2d5a6",
        tertiary90: "#f9ead2",
        tertiary97: "#fdf9f2",
        tertiary100: "#ffffff",
      },
    },
  },
  plugins: [typography],
};
