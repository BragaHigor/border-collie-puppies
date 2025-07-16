"use client";

import { JSX, useCallback, useContext, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { PuppiesCarousel } from "../Carousel/PuppiesCarousel";
import { motion } from "framer-motion";
import { PuppiesContext } from "@/contexts/context";
import { fadeIn } from "@/utils/functions/variants";

const CATEGORY_CONFIG = [
   { value: "all", label: "Todos", icon: null },
   {
      value: "macho",
      label: "Macho",
      icon: "/assets/icons/male_icon.svg",
   },
   {
      value: "fêmea",
      label: "Fêmea",
      icon: "/assets/icons/female_icon.svg",
   },
];

export function UpcomingSection(): JSX.Element {
   const { filterBySex } = useContext(PuppiesContext);
   const [category, setCategory] = useState<string>("all");

   const filteredAndSorted = useMemo(() => {
      const list = filterBySex(category);

      return [...list].sort(
         (a, b) => (b.availability ? 1 : 0) - (a.availability ? 1 : 0)
      );
   }, [category, filterBySex]);

   const handleCategoryChange = useCallback((value: string) => {
      setCategory(value);
   }, []);

   return (
      <motion.section
         variants={fadeIn({ direction: "up", delay: 0.2 })}
         initial="hidden"
         whileInView="show"
         viewport={{ once: false, amount: 0.2 }}
      >
         <div className="mb-12 text-center">
            <h3 className="pretitle">Venham conhecer nossos filhotes</h3>
            <h2 className="h2 text-secondary">
               Escolha o que você achar mais fofinho
            </h2>
         </div>
         <div className="flex flex-col xl:flex-row items-center justify-between mb-12">
            <Tabs
               value={category}
               onValueChange={handleCategoryChange}
               className="bg-transparent w-full max-w-[25rem] h-full flex justify-center items-center mb-12 xl:mb-0"
            >
               <TabsList className="flex flex-col lg:flex-row gap-6 bg-transparent w-full h-full">
                  {CATEGORY_CONFIG.map(({ value, label, icon }) => (
                     <TabsTrigger
                        key={value}
                        value={value}
                        className="flex items-center"
                     >
                        {icon && (
                           <span aria-hidden="true" className="mr-2">
                              <Image src={icon} width={18} height={18} alt="" />
                           </span>
                        )}
                        {label}
                     </TabsTrigger>
                  ))}
               </TabsList>
            </Tabs>
            <Link
               href={"/puppies#puppies-all"}
               className="uppercase border-b-2 border-secondary text-sm font-semibold text-secondary hover:text-accent-hover transition-colors duration-300"
            >
               Ver todos os filhotes
            </Link>
         </div>
         <PuppiesCarousel puppies={filteredAndSorted} />
      </motion.section>
   );
}
