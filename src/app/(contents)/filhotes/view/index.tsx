"use client";

import React, { ReactElement } from "react";
import Head from "next/head";
import { PuppiesList } from "@/components/sections/InfoPuppies/PuppiesList";

export default function PuppiesView(): ReactElement {
   return (
      <>
         <Head>
            <title>Todos os Filhotes | Encinas & Braga Border Collie</title>
         </Head>
         <main
            aria-label="Página com todos os filhotes"
            className="container mx-auto px-4 py-8 bg-black-200 pt-52 xl:pt-12"
         >
            <PuppiesList />
         </main>
      </>
   );
}
