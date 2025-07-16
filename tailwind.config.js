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
         colors: {
            primary: "#F7FAFC",
            accent: {
               DEFAULT: "#000000",
               hover: "#222222",
            },
            secondary: {
               DEFAULT: "#C79F6A",
               hover: "#A67C52",
            },
            text: "#1A202C",
            lightText: "#4A5568",
            white: "#FFFFFF",
         },
         backdropBlur: {
            xs: "2px",
            "1.25rem": "1.25rem",
         },
         backgroundImage: {
            pattern: "url('/assets/background/footer/pattern-bg.png')",
         },
      },
   },
   // eslint-disable-next-line @typescript-eslint/no-require-imports
   plugins: [require("tailwindcss-animate")],
};
