"use client";

import { IoColorPaletteOutline } from "react-icons/io5";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useCallback, useContext, useMemo } from "react";
import { PuppiesContext } from "@/contexts/context";

export function ColorSearch() {
   const { puppies, selectedColor, setSelectedColor } =
      useContext(PuppiesContext);

   const uniqueColor = useMemo(() => {
      const colors = puppies.map((a) => a.color);
      return ["Todas as cores", ...Array.from(new Set(colors))];
   }, [puppies]);

   const handleChange = useCallback(
      (value: string) => {
         setSelectedColor(value);
      },
      [setSelectedColor]
   );

   return (
      <div className="flex items-center gap-2.5 w-full xl:w-[11.875rem] select-none">
         <span className="text-lg text-primary" aria-hidden="true">
            <IoColorPaletteOutline size={24} />
         </span>
         <Select
            value={selectedColor}
            onValueChange={handleChange}
            aria-label="Filtrar por cores"
         >
            <SelectTrigger className="bg-white text-accent border-b-2 border-accent capitalize">
               <SelectValue placeholder="Cores" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  {uniqueColor.map((color) => (
                     <SelectItem
                        key={color}
                        value={color}
                        className="capitalize"
                     >
                        {color}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
      </div>
   );
}
