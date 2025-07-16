"use client";

import { JSX, useContext } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { FaqItem } from "./FaqItem";
import { fadeIn } from "@/utils/functions/variants";
import { PuppiesContext } from "@/contexts/context";

const faqItemVariants = {
   hidden: { opacity: 0, y: 30 },
   visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.3 },
   }),
};

export function FaqSection(): JSX.Element {
   const { faqItems } = useContext(PuppiesContext);

   return (
      <section className="mb-12">
         <div className="container mx-auto">
            <motion.div
               variants={fadeIn({ direction: "up", delay: 0.2 })}
               initial="hidden"
               whileInView="show"
               viewport={{ once: false, amount: 0.2 }}
               className="text-center max-w-[540px] mx-auto xl:mb-20"
            >
               <h2 className="h2 mb-3">Dúvidas</h2>
               <p className="mb-11 max-w-[480px] mx-auto">
                  Confira as dúvidas mais frequentes que recebemos. Se você
                  tiver mais perguntas, não hesite em entrar em contato conosco!
               </p>
            </motion.div>
            <div>
               <ul className="w-full flex flex-col">
                  {faqItems.map((item, index) => {
                     return (
                        <motion.li
                           key={index}
                           variants={faqItemVariants}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{ once: false, amount: 0.2 }}
                           custom={index}
                        >
                           <FaqItem
                              title={item.title}
                              description={item.description}
                           />
                        </motion.li>
                     );
                  })}
               </ul>
            </div>
         </div>
      </section>
   );
}
