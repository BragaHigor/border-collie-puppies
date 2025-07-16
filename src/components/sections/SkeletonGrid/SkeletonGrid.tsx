"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { JSX } from "react";

interface SkeletonGridProps {
   itemCount?: number;
}

export function SkeletonGrid({
   itemCount = 12,
}: SkeletonGridProps): JSX.Element {
   const placeholders = Array.from({ length: itemCount });

   return (
      <div
         role="status"
         aria-busy="true"
         aria-label="Carregando conteúdos"
         className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 mb-32"
      >
         {placeholders.map((_, index) => (
            <div
               key={index}
               role="listitem"
               className="flex flex-col space-y-3"
            >
               <Skeleton className="h-56 rounded-xl bg-secondary/50" />
               <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-secondary/50" />
                  <Skeleton className="h-4 w-48 bg-secondary/50" />
               </div>
            </div>
         ))}
      </div>
   );
}
