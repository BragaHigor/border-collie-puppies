import React, { ReactElement } from "react";
import type { Metadata } from "next";
import PuppiesView from "../view";

export const metadata: Metadata = {
   title: "Todos os Filhotes | Encinas & Braga Border Collie",
   description: "Veja todos os filhotes de border collie disponíveis.",
   openGraph: {
      title: "Todos os Filhotes | Encinas & Braga Border Collie",
      description: "Veja todos os filhotes de border collie disponíveis.",
      url: "/fihlotes",
   },
};

export default async function ArticlesController(): Promise<ReactElement> {
   return <PuppiesView />;
}
