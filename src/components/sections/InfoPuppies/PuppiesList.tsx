"use client";

import { JSX, useContext, useMemo } from "react";
import { SkeletonGrid } from "../SkeletonGrid/SkeletonGrid";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PuppiesContext } from "@/contexts/context";
import { PuppiesCard } from "./PuppiesCard";
import { Puppy } from "@/types";

export function PuppiesList(): JSX.Element {
   const { filteredPuppies, isLoading, error } = useContext(PuppiesContext);

   const orderedPuppies = useMemo(() => {
      return [...filteredPuppies].sort((a, b) => {
         return (
            (b.availability === true ? 1 : 0) -
            (a.availability === true ? 1 : 0)
         );
      });
   }, [filteredPuppies]);

   if (isLoading) {
      return (
         <section
            role="status"
            aria-busy="true"
            aria-label="Carregando filhotes"
         >
            <SkeletonGrid />
         </section>
      );
   }

   if (error) {
      return <section role="alert">{notFound()}</section>;
   }

   if (filteredPuppies.length === 0) {
      return (
         <section aria-live="polite" className="h-[80vh]">
            <p className="text-quaternary text-center mt-6">
               Nenhum filhote encontrado com essas características procure por
               outro.
            </p>
         </section>
      );
   }

   return (
      <section id="puppies-all" aria-label="Lista de filhotes">
         <div className="flex flex-row gap-2 mb-6">
            <h4 className="text-lg text-accent">{filteredPuppies.length}</h4>
            <h4 className="text-lg text-secondary">
               {filteredPuppies.length === 1
                  ? "filhote encontrado."
                  : "filhotes encontrados."}
            </h4>
         </div>
         <ul className="grid grid-cols-1 xl:grid-cols-4 gap-[1.875rem] mb-32">
            {orderedPuppies.map((puppy: Puppy) => (
               <li key={puppy.id}>
                  <Link href={`/filhotes/${puppy.id}`}>
                     <PuppiesCard puppies={puppy} />
                  </Link>
               </li>
            ))}
         </ul>
      </section>
   );
}
