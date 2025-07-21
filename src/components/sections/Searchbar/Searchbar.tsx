"use client";

import { JSX, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { BiRightArrowAlt } from "react-icons/bi";
import { PuppiesContext } from "@/contexts/context";
import { SexSearch } from "./SexSearch";
import { ColorSearch } from "./ColorSearch";

export function Searchbar(): JSX.Element {
   const router = useRouter();
   const { handleSubmit } = useContext(PuppiesContext);

   const onSearch = useCallback(() => {
      router.push("/filhotes#puppies-all");
      handleSubmit();
   }, [router, handleSubmit]);

   return (
      <div className="bg-secondary w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-max p-8 xl:pl-8 xl:pr-2 h-auto xl:h-[4.375rem] rounded-3xl xl:roundend-full backgrop-blur-[1.25rem] flex flex-col xl:flex-row items-center gap-6 mx-auto text-sm z-50">
         <SexSearch />
         <div className="hidden xl:flex border-l border-accent/10 h-5" />
         <ColorSearch />
         <button
            onClick={onSearch}
            aria-label="Buscar filhotes"
            className="w-full xl:w-[3.375rem] h-[3.375rem] rounded-[2.5rem] xl:rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors duration-300"
         >
            <BiRightArrowAlt className="text-3xl text-primary" />
         </button>
      </div>
   );
}
