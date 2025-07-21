import React, { ReactElement } from "react";
import { notFound } from "next/navigation";
import type { Puppy } from "@/types";
import PuppiesDetailView from "../view";
import mockPuppies from "@/utils/mock/puppies-mock.json";

type Props = {
   params: Promise<{ id: string }>;
};

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
