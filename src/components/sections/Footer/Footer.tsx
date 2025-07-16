"use client";

import { generateWhatsappLink } from "@/utils/functions/whatsapp";
import Image from "next/image";
import { JSX, useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const svgs = [
   "/assets/background/dogs/dog-breed-svgrepo-com (1).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (2).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (3).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (4).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (5).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (6).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (7).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (8).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (9).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (10).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (11).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (12).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (13).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (14).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (15).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (16).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (17).svg",
   "/assets/background/dogs/dog-breed-svgrepo-com (18).svg",
];

export function Footer(): JSX.Element {
   const [shuffledSvgs, setShuffledSvgs] = useState<string[]>([]);

   useEffect(() => {
      const array = [...svgs];
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
      setShuffledSvgs(array);
   }, []);

   const whatsappLink = generateWhatsappLink({
      text: "Olá! Vim pelo site dos filhotes de Border Collie!.",
   });

   const iconDogs = useMemo(
      () =>
         shuffledSvgs.slice(0, 5).map((src, idx) => (
            <div key={idx} className="relative text-primary">
               <Image
                  src={src}
                  alt={`Ícone dog ${idx + 1}`}
                  width={100}
                  height={100}
               />
            </div>
         )),
      [shuffledSvgs]
   );

   return (
      <footer className="bg-secondary bg-pattern bg-cover bg-blend-multiply pt-16">
         <div className="container mx-auto border-b border-primary/40">
            <div className="flex flex-col max-w-[46.875rem] mx-auto text-center">
               <div className="mb-9">
                  <h2 className="h2 mb-3 text-primary">
                     Seu Novo Companheiro Aguarda
                  </h2>
                  <p className="text-primary">
                     Conheça os filhotes disponíveis e garanta um amigo leal,
                     inteligente e cheio de energia.
                  </p>
               </div>
               <div className="mb-[4.5rem] flex gap-8 justify-center">
                  {iconDogs}
               </div>
            </div>
         </div>
         <div className="py-8">
            <div className="container mx-auto">
               <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <p className="text-sm text-primary">
                     Copyright &copy; 2025. Todos os direitos reservados.
                  </p>
                  <a
                     href={whatsappLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     onClick={(e) => {
                        e.stopPropagation();
                     }}
                     className="
                          bg-green-500 hover:bg-green-600 text-white
                          flex items-center justify-center gap-2
                          px-4 py-2 rounded-full transition-colors
                        "
                  >
                     <FaWhatsapp className="text-xl" aria-hidden="true" />
                     <span className="text-sm font-medium">
                        Entrar em contato
                     </span>
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}
