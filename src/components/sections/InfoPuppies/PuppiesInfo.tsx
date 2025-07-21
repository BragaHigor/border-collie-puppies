"use client";

import { useMemo } from "react";
import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { BiCalendar } from "react-icons/bi";
import { Puppy } from "@/types";
import { FaWhatsapp } from "react-icons/fa";
import { IoColorPaletteOutline } from "react-icons/io5";
import { generateWhatsappLink } from "@/utils/functions/whatsapp";

interface ArticlesInfoProps {
   puppies: Puppy;
}

export function PuppiesInfo({ puppies }: ArticlesInfoProps) {
   const dbDate = puppies.dateOfBirth;
   const displayDate = useMemo(() => {
      const dateObj = parseISO(dbDate);
      return dbDate
         ? format(dateObj, "dd 'de' MMM, yyyy", { locale: ptBR })
         : "Data";
   }, [dbDate]);

   const interestWhatsappLink = generateWhatsappLink({
      sex: puppies.sex,
      color: puppies.color,
   });

   const isAvailable = puppies.availability === true;
   const bgAvailClass = isAvailable ? "bg-green-600" : "bg-red-600";

   const bgSexClass =
      puppies.sex.toLowerCase() === "macho" ? "bg-blue-500" : "bg-pink-500";

   return (
      <div className="bg-secondary/20 py-8 px-6 md:px-12 xl:px-16 w-[350px] flex flex-col gap-8 rounded-2xl">
         <div>
            <h3 className="h3 mb-4 text-accent">Informações:</h3>
            <div className="w-[4.625rem] h-[0.1875rem] bg-accent rounded-3xl mb-4"></div>
            <div className="flex gap-2">
               <span
                  className={`text-primary w-[6.875rem] h-12 text-[0.8125rem] uppercase font-medium rounded-full flex items-center justify-center ${bgSexClass}`}
               >
                  {puppies.sex}
               </span>
               <span
                  className={`text-primary w-[6.875rem] h-12 text-[0.8125rem] uppercase font-medium rounded-full flex items-center justify-center ${bgAvailClass}`}
               >
                  {isAvailable ? "Disponível" : "Indisponível"}
               </span>
            </div>
            <div className="flex items-center gap-2 mt-4">
               <BiCalendar
                  aria-hidden="true"
                  className="text-2xl text-accent"
               />
               <time dateTime={displayDate} className="text-lightText">
                  {displayDate}
               </time>
            </div>
            <div className="flex items-center gap-1 pt-2">
               <IoColorPaletteOutline
                  aria-hidden="true"
                  className="text-2xl text-accent"
               />
               <span className="text-[1rem] text-lightText capitalize">
                  {puppies.color}
               </span>
            </div>
            <div className="inset-x-0 mt-4 justify-center">
               {isAvailable ? (
                  <a
                     href={interestWhatsappLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     onClick={(e) => {
                        e.stopPropagation();
                     }}
                     className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors"
                  >
                     <FaWhatsapp className="text-xl" aria-hidden="true" />
                     <span className="text-sm font-medium">
                        Entrar em contato
                     </span>
                  </a>
               ) : (
                  <button
                     disabled
                     onClick={(e) => e.stopPropagation()}
                     className="opacity-50 cursor-not-allowed bg-gray-400 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-full"
                  >
                     <FaWhatsapp className="text-xl" aria-hidden="true" />
                     <span className="text-sm font-medium">
                        Entrar em contato
                     </span>
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
