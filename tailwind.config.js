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
         fontSize: {
            "display-1": ["4.375rem", { lineHeight: "4.875rem" }],
            "display-2": "2.75rem",
            "display-3": "2rem",
            pretitle: "2.875rem",
         },
         keyframes: {
            float: {
               "0%, 100%": { transform: "translateY(0px)" },
               "50%": { transform: "translateY(-40px)" },
            },
         },
         animation: {
            float: "float 10s ease-in-out infinite",
            "float-slow": "float 14s ease-in-out infinite",
            "float-fast": "float 8s ease-in-out infinite",
         },
      },
   },
   // eslint-disable-next-line @typescript-eslint/no-require-imports
   plugins: [require("tailwindcss-animate")],
};
