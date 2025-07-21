import React, { ReactElement } from "react";
import { notFound } from "next/navigation";
import type { Puppy } from "@/types";
import PuppiesDetailView from "../view";
import mockPuppies from "@/utils/mock/puppies-mock.json";
import type { Metadata } from "next";

type Props = {
   params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { id } = await params;
   const puppy = (mockPuppies.puppies as Puppy[]).find((p) => p.id === id);

   if (!puppy) {
      return {
         title: "Filhote não encontrado | Encinas & Braga Border Collie",
      };
   }

   const sexLabel = puppy.sex[0].toUpperCase() + puppy.sex.slice(1);
   const availabilityLabel = puppy.availability ? "Disponível" : "Indisponível";

   return {
      title: `Filhote ${sexLabel} ${availabilityLabel} | Encinas & Braga Border Collie`,
   };
}

export default async function PuppiesDetailController({
   params,
}: Props): Promise<ReactElement> {
   const { id } = await params;
   const puppy = (mockPuppies.puppies as Puppy[]).find((p) => p.id === id);

   if (!puppy) {
      notFound();
   }

   return <PuppiesDetailView puppies={puppy!} />;
}
