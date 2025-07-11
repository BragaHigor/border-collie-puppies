/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: ["class"],
   content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      container: {
         center: true,
         padding: "15px",
      },
      screens: {
         sm: "640px",
         md: "768px",
         lg: "1024px",
         xl: "1310px",
      },
      fontFamily: {
         primary: "var(--font-poppins)",
         secondary: "var(--font-caveat)",
      },
      extend: {
         colors: {},
         backdropBlur: {
            xs: "2px",
            "1.25rem": "1.25rem",
         },
      },
   },
   // eslint-disable-next-line @typescript-eslint/no-require-imports
   plugins: [require("tailwindcss-animate")],
};
