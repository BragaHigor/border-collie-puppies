import React, { ReactElement } from "react";
import { Metadata } from "next";
import HomeView from "../view";

export const metadata: Metadata = {
   title: "Página inicial | Encinas & Braga Border Collie",
   description: "Veja todos os filhotes de border collie disponíveis.",
   openGraph: {
      title: "Página inicial | Encinas & Braga Border Collie",
      description: "Veja todos os filhotes de border collie disponíveis.",
      url: "/",
   },
};

export default function HomeController(): ReactElement {
   return <HomeView />;
}
