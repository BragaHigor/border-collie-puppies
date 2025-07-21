import { ReactElement } from "react";
import Link from "next/link";
import { BackgroundDogs } from "@/components/background/BackgroundDogs";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "404 – Página não encontrada | Encinas & Braga Border Collie",
   description:
      "Oops! A página que você procura não foi encontrada. Volte e encontre o seu filhote!",
   robots: {
      index: false,
      follow: true,
   },
   openGraph: {
      title: "404 – Página não encontrada | Encinas & Braga Border Collie",
      description:
         "A página solicitada não existe ou foi removida. Volte e encontre o seu filhote!",
      url: "fihlotes-encinas-braga.vercel.app/404",
      siteName: "Encinas & Braga Border Collie",
      type: "website",
   },
};

export default function NotFound(): ReactElement {
   return (
      <main
         role="main"
         className="h-screen flex flex-col justify-center items-center text-center px-4"
      >
         <BackgroundDogs aria-hidden="true" />
         <h1 className="text-5xl font-bold text-accent mb-4">
            Página não encontrada
         </h1>
         <p className="text-secondary text-lg mb-8">
            A página que você procura não existe ou foi removida.
         </p>
         <Link
            href="/"
            className="bg-accent hover:bg-accent-hover text-white font-medium py-2 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
         >
            Voltar para o início
         </Link>
      </main>
   );
}
