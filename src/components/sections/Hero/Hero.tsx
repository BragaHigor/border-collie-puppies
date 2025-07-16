"use client";

import { JSX, useCallback, useContext } from "react";
import { Searchbar } from "../Searchbar/Searchbar";
import { PuppiesContext } from "@/contexts/context";
import { BackgroundDogs } from "@/components/background/BackgroundDogs";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/functions/variants";

export function Hero(): JSX.Element {
   const { handleClearSearch } = useContext(PuppiesContext);

   const onClear = useCallback(() => {
      handleClearSearch();
   }, [handleClearSearch]);

   return (
      <section className="h-screen relative">
         <BackgroundDogs aria-hidden="true" />
         <motion.div
            variants={fadeIn({ direction: "up", delay: 0.1 })}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="container mx-auto h-full flex flex-col justify-center items-center"
         >
            <div className="w-full max-w-[100rem] text-center mx-auto flex flex-col gap-2 pt-80 xl:pt-16">
               <div className="pretitle">
                  Alegria, Energia e Companheirismo.
               </div>
               <h1 className="h1">
                  Encontre aqui o filhote perfeito
                  <br />
                  da raça Border Collie.
               </h1>
               <p className="tex-sm xl:text-lg font-light text-text mb-4 xl:mb-12 max-w-[30rem] xl:max-w-none mx-auto">
                  Viva momentos especiais ao lado de um companheiro inteligente,
                  brincalhão e cheio de vida.
               </p>
            </div>
            <div>
               <Searchbar />
               <div className="w-full mt-3 relative flex flex-col">
                  <p className="text-sm italic font-light text-accent mb-3 xl:mb-0 justify-start">
                     Selecione pelo menos um campo.
                  </p>
                  <button
                     className="text-secondary text-sm xl:absolute right-0"
                     onClick={onClear}
                  >
                     limpar as buscas
                  </button>
               </div>
            </div>
         </motion.div>
      </section>
   );
}
