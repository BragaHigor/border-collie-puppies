"use client";

import React, { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Puppy } from "@/types";

interface PuppiesCarouselProps {
   puppies: Puppy;
}

export const PuppiesCarousel: FC<PuppiesCarouselProps> = ({ puppies }) => {
   const gallery = puppies.images.gallery;
   const images =
      Array.isArray(gallery) && gallery.length > 0
         ? gallery
         : [puppies.images.img_lg];

   if (images.length === 0) {
      return (
         <div className="w-full h-full flex items-center justify-center text-gray-500">
            Sem imagens disponíveis
         </div>
      );
   }

   return (
      <div className="relative w-full h-[20rem] xl:max-w-[41.875rem] xl:h-[31.25rem] rounded-2xl overflow-hidden mb-12 xl:mb-0">
         <Swiper
            modules={[Pagination, Navigation, A11y]}
            slidesPerView={1}
            spaceBetween={10}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            a11y={{
               prevSlideMessage: "Imagem anterior",
               nextSlideMessage: "Próxima imagem",
               firstSlideMessage: "Primeira imagem",
               lastSlideMessage: "Última imagem",
            }}
            className="relative w-full h-full"
         >
            {images.map((src, idx) => (
               <SwiperSlide key={idx} className="relative w-full h-full">
                  <Image
                     src={src}
                     alt={`Imagem do filhote ${idx + 1}`}
                     fill
                     className="object-cover"
                     priority={idx === 0}
                  />
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
};
