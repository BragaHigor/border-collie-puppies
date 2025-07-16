"use client";

import React, { JSX, useCallback, useContext } from "react";
import Link from "next/link";
import { PuppiesContext } from "@/contexts/context";
import Image from "next/image";

export function Header(): JSX.Element {
   const { handleClearSearch } = useContext(PuppiesContext);

   const onClear = useCallback(() => {
      handleClearSearch();
   }, [handleClearSearch]);

   return (
      <header className="absolute inset-x-0 z-10 ">
         <div className="container mx-auto h-full py-4 xl:py-6">
            <div className="flex justify-center items-center h-full">
               <Link
                  href="/"
                  onClick={onClear}
                  aria-label="Ir para a página inicial"
               >
                  <Image
                     src="/assets/logo-site/logo.png"
                     width={150}
                     height={150}
                     alt="Logo do site"
                     priority
                  />
               </Link>
            </div>
         </div>
      </header>
   );
}
