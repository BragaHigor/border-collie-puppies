"use client";

import { JSX, useCallback, useContext, useMemo } from "react";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { PiGenderIntersexBold } from "react-icons/pi";
import { PuppiesContext } from "@/contexts/context";

export function SexSearch(): JSX.Element {
   const { puppies, selectedSex, setSelectedSex } = useContext(PuppiesContext);

   const uniqueSex = useMemo(() => {
      const sexs = puppies.map((a) => a.sex);
      return ["Todos os sexos", ...Array.from(new Set(sexs))];
   }, [puppies]);

   const handleChange = useCallback(
      (value: string) => {
         setSelectedSex(value);
      },
      [setSelectedSex]
   );

   return (
      <div className="flex items-center gap-2.5 w-full xl:w-[11.875rem] select-none">
         <span className="text-lg text-primary" aria-hidden="true">
            <PiGenderIntersexBold size={24} />
         </span>
         <Select
            value={selectedSex}
            onValueChange={handleChange}
            aria-label="Filtrar por sexo"
         >
            <SelectTrigger className="bg-white text-accent border-b-2 border-accent capitalize">
               <SelectValue placeholder="Sexo" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  {uniqueSex.map((sex) => (
                     <SelectItem key={sex} value={sex} className="capitalize">
                        {sex}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
      </div>
   );
}
