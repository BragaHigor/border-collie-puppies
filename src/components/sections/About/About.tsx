"use client";

import Image from "next/image";
import { ReactElement } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/functions/variants";

export function AboutSection(): ReactElement {
   return (
      <section aria-labelledby="about-heading" className="mb-24">
         <motion.div
            variants={fadeIn({ direction: "up", delay: 0.1 })}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="container mx-auto px-4 sm:px-6"
         >
            <div className="mb-8 text-center">
               <h3 id="about-heading" className="pretitle">
                  Sobre Nós
               </h3>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8">
               <div className="flex-1 w-full overflow-hidden rounded-2xl">
                  <Image
                     src="/assets/about/sobre-nos.png"
                     alt="Foto da seção Sobre Nós"
                     width={1200}
                     height={800}
                     priority
                     className="object-cover w-full h-auto sm:h-[20rem] md:h-[24rem] lg:h-[28rem]"
                  />
               </div>
               <div className="flex-1 space-y-4">
                  <h4 className="h4">Nossa História</h4>
                  <p className="text-segundary">
                     Fundado em 2024, o Blog nasceu com o propósito de unir
                     arte, música e lifestyle em um só lugar. Aqui você encontra
                     inspirações, novidades e dicas selecionadas por uma
                     comunidade apaixonada por criatividade.
                  </p>
                  <p className="text-segundary">
                     Nossa equipe é formada por entusiastas de diferentes áreas,
                     que compartilham histórias, eventos e experiências para
                     conectar pessoas que amam o que fazem. Junte-se a nós nesta
                     jornada!
                  </p>
               </div>
            </div>
         </motion.div>
      </section>
   );
}
