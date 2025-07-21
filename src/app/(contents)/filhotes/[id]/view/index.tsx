"use client";

import { ReactElement } from "react";
import Head from "next/head";
import { Puppy } from "@/types";
import { UpcomingSection } from "@/components/sections/Upcoming/Upcoming";
import { PuppiesInfo } from "@/components/sections/InfoPuppies/PuppiesInfo";
import { PuppiesCarousel } from "@/components/sections/InfoPuppies/PuppiesCarousel";

interface PuppiesDetailViewProps {
   puppies: Puppy;
}

export default function PuppiesDetailView({
   puppies,
}: PuppiesDetailViewProps): ReactElement {
   return (
      <>
         <Head>
            <title>Filhote disponível | Encinas & Braga Border Collie</title>
         </Head>
         <section className="min-h-screen flex items-center py-8 sm:py-32">
            <div className="container mx-auto">
               <div className="w-full max-w-[37.5rem] xl:max-w-none mx-auto">
                  <div className="flex flex-col gap-8 xl:gap-24 xl:flex-row pt-10 pb-12 sm:py-0 xl:mb-24">
                     <div className="relative w-full h-[20rem] xl:max-w-[41.875rem] xl:h-[31.25rem] rounded-2xl overflow-hidden mb-12 xl:mb-0">
                        <PuppiesCarousel puppies={puppies} />
                     </div>
                     <div className="flex w-full max-w-[28.75rem] flex-col justify-center gap-8 flex-1 sm:mb-12 xl:mb-0">
                        <div className="w-full max-w-[28.75rem]">
                           <PuppiesInfo puppies={puppies} />
                        </div>
                     </div>
                  </div>
               </div>
               <UpcomingSection />
            </div>
         </section>
      </>
   );
}
