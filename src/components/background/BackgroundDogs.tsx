"use client";

import { useEffect, useState } from "react";

export function BackgroundDogs() {
   const svgs = [
      "/assets/background/dogs/dog-breed-svgrepo-com (1).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (2).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (3).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (4).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (5).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (6).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (7).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (8).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (9).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (10).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (11).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (12).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (13).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (14).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (15).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (16).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (17).svg",
      "/assets/background/dogs/dog-breed-svgrepo-com (18).svg",
   ];

   const [shuffledSvgs, setShuffledSvgs] = useState<string[]>(svgs);

   useEffect(() => {
      const array = [...svgs];
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
      setShuffledSvgs(array);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const cols = 6;
   const hSpacing = 200;
   const vSpacing = 150;
   const rows = Math.ceil(shuffledSvgs.length / cols);
   const viewWidth = 1150;
   const viewHeight = 530;
   const totalGridWidth = (cols - 1) * hSpacing;
   const totalGridHeight = (rows - 1) * vSpacing;
   const startX = (viewWidth - totalGridWidth) / 2;
   const startY = (viewHeight - totalGridHeight) / 2;

   return (
      <svg
         viewBox={`0 0 ${viewWidth} ${viewHeight}`}
         className="absolute inset-0 -z-10 w-full h-full pointer-events-none opacity-10"
         xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice"
      >
         {shuffledSvgs.map((href, i) => {
            const size = 80 + (i % 3) * 10;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * hSpacing - size / 2;
            const y = startY + row * vSpacing - size / 2;
            const animClass =
               i % 3 === 0
                  ? "animate-float"
                  : i % 3 === 1
                  ? "animate-float-slow"
                  : "animate-float-fast";

            return (
               <image
                  key={href}
                  href={href}
                  x={x}
                  y={y}
                  width={size}
                  height={size}
                  className={animClass}
               />
            );
         })}
      </svg>
   );
}
