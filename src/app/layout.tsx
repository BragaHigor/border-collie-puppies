import "@/styles/globals.css";
import { Header } from "@/components/sections/Header/Header";
import { PuppiesProvider } from "@/contexts/context";
import type { Metadata } from "next";
import { Caveat, Poppins } from "next/font/google";
import { Footer } from "@/components/sections/Footer/Footer";

export const metadata: Metadata = {
   metadataBase: new URL(process.env.SITE_URL!),
   title: "Encinas & Braga Border Collie",
   description: "Filhotes de Border Collie de alta qualidade.",
   keywords: ["border collie", "filhotes", "cachorro"],
   robots: {
      index: true,
      follow: true,
   },
   openGraph: {
      title: "Encinas & Braga Border Collie",
      description: "Filhotes de Border Collie de alta qualidade.",
      url: "/",
      siteName: "Encinas & Braga",
      images: [
         {
            url: "/assets/logo-site/logo.png",
            width: 1200,
            height: 630,
            alt: "Encinas & Braga Border Collie",
         },
      ],
      type: "website",
   },
   twitter: {
      card: "summary_large_image",
   },
   icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
   },
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
}: {
   children: React.ReactNode;
}) {
   return (
      <PuppiesProvider>
         <html lang="pt-BR">
            <head>
               <link rel="preconnect" href="https://fonts.googleapis.com" />
               <link
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
                  crossOrigin=""
               />
               <link
                  rel="preload"
                  as="image"
                  href="/assets/logo-site/logo.png"
               />
            </head>
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
