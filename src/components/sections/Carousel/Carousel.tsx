"use client";

import React, { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import { Puppy } from "@/types";
import { SkeletonGrid } from "../SkeletonGrid/SkeletonGrid";
import { PuppiesCard } from "../InfoPuppies/PuppiesCard";

interface PuppiesCarouselProps {
   puppies: Puppy[];
   fallbackCount?: number;
}

export function Carousel({
   puppies,
   fallbackCount = 4,
}: PuppiesCarouselProps): JSX.Element {
   if (puppies.length === 0) {
      return <SkeletonGrid itemCount={fallbackCount} />;
   }

   return (
      <Swiper
         slidesPerView={1}
         spaceBetween={30}
         pagination={{ dynamicBullets: true, clickable: true }}
         breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1310: { slidesPerView: 4 },
         }}
         modules={[Pagination]}
         className="w-full h-[31.25rem]"
      >
         {puppies.map((puppy) => {
            return (
               <SwiperSlide key={puppy.id} className="select-none">
                  <div className="relative">
                     <Link href={`/filhotes/${puppy.id}`}>
                        <PuppiesCard puppies={puppy} />
                     </Link>
                  </div>
               </SwiperSlide>
            );
         })}
      </Swiper>
   );
}
