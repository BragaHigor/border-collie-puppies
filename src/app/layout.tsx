import "@/styles/globals.css";
import { Header } from "@/components/sections/Header/Header";
import { PuppiesProvider } from "@/contexts/context";
import type { Metadata } from "next";
import { Caveat, Poppins } from "next/font/google";
import { Footer } from "@/components/sections/Footer/Footer";

export const metadata: Metadata = {
   title: "Página Inicial | Encinas & Braga Border Collie",
   description: "Encinas & Braga Border Collie - Filhotes de Border Collie",
};

const poppins = Poppins({
   variable: "--font-poppins",
   subsets: ["latin"],
   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
   display: "swap",
});
const caveat = Caveat({
   variable: "--font-caveat",
   subsets: ["latin"],
   weight: ["400", "500", "600", "700"],
   display: "swap",
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <PuppiesProvider>
         <html lang="pt-br">
            <body
               className={`${poppins.variable} ${caveat.variable} antialiased`}
            >
               <Header />
               {children}
               <Footer />
            </body>
         </html>
      </PuppiesProvider>
   );
}
