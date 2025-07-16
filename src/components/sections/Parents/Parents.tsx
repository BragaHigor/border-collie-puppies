"use client";

import { ReactElement, useContext } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { IoColorPaletteOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { fadeIn } from "@/utils/functions/variants";
import { Parent } from "@/types";
import { PuppiesContext } from "@/contexts/context";

export function ParentsSection(): ReactElement {
   const { parents } = useContext(PuppiesContext);

   return (
      <motion.section
         variants={fadeIn({ direction: "up", delay: 0.1 })}
         initial="hidden"
         whileInView="show"
         viewport={{ once: false, amount: 0.2 }}
         className="mb-24"
      >
         <div className="mb-8 text-center">
            <h3 className="pretitle">Conheça nossos papais</h3>
         </div>
         <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12">
               {parents.map((parent: Parent) => (
                  <figure
                     key={parent.id}
                     className="flex-1 flex flex-col items-center text-center"
                  >
                     <div className="relative w-full lg:max-w-[28rem]">
                        <Swiper
                           slidesPerView={1}
                           spaceBetween={10}
                           pagination={{
                              dynamicBullets: true,
                              clickable: true,
                           }}
                           modules={[Pagination]}
                           className="w-full h-[20rem] rounded-2xl overflow-hidden"
                        >
                           {parent.images.map((img, idx) => (
                              <SwiperSlide key={idx} className="relative">
                                 <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="rounded-2xl object-cover"
                                    priority={idx === 0}
                                 />
                              </SwiperSlide>
                           ))}
                        </Swiper>

                        <span
                           className={`absolute -bottom-3 left-4 z-20 uppercase text-xs font-medium rounded-full flex items-center justify-center w-[6.875rem] h-12
                    ${
                       parent.role === "Pai"
                          ? "bg-blue-500 text-white"
                          : "bg-pink-500 text-white"
                    }
                  `}
                        >
                           {parent.role}
                        </span>
                     </div>
                     <figcaption className="mt-4">
                        <h4 className="text-lg font-semibold">{parent.name}</h4>
                        <div className="flex items-center justify-center gap-1">
                           <IoColorPaletteOutline aria-hidden="true" />
                           <p className="text-sm italic text-text">
                              {parent.color}
                           </p>
                        </div>
                     </figcaption>
                  </figure>
               ))}
            </div>
         </div>
      </motion.section>
   );
}
