import { Puppy } from "@/types";
import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { JSX, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { generateWhatsappLink } from "@/utils/functions/whatsapp";

interface PuppiesCardProps {
   puppies: Puppy;
}

export function PuppiesCard({ puppies }: PuppiesCardProps): JSX.Element {
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
      <article className="bg-secondary/20 hover:bg-secondary/50 transition-colors rounded-3xl overflow-hidden flex flex-col justify-start h-[27.5rem] w-[20rem] sm:w-full mx-auto sm:mx-0 p-4">
         <div className="relative w-full h-[20rem] mb-10">
            <Image
               src={puppies.images.img_sm}
               alt="Imagem do filhote"
               fill
               quality={100}
               sizes="(max-width: 640px) 100vw, 20rem"
               className="rounded-2xl object-cover"
            />
            <div className="absolute -bottom-6 left-4 flex gap-2">
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
         </div>
         <div className="pl-4 flex flex-col justify-between h-1/2">
            <div>
               <div className="flex flex-col items-center text-accent mb-2 gap-3">
                  <div className="flex items-center gap-1">
                     <BiCalendar aria-hidden="true" />
                     <time
                        dateTime={displayDate}
                        className="text-[0.9375rem] text-lightText"
                     >
                        {displayDate}
                     </time>
                  </div>
                  <div className="flex items-center gap-1">
                     <IoColorPaletteOutline aria-hidden="true" />
                     <span className="text-[0.9375rem] text-lightText capitalize">
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
         </div>
      </article>
   );
}
