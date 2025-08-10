"use client";

import React, { ReactElement } from "react";
import Head from "next/head";
// import { AboutSection } from "@/components/sections/About/About";
// import { FaqSection } from "@/components/sections/Faq/Faq";
import { Hero } from "@/components/sections/Hero/Hero";
import { ParentsSection } from "@/components/sections/Parents/Parents";
import { UpcomingSection } from "@/components/sections/Upcoming/Upcoming";

export default function HomeView(): ReactElement {
   return (
      <>
         <Head>
            <title>Página Inicial | Encinas & Braga Border Collie</title>
            <meta
               name="description"
               content="Bem-vindo ao Encinas & Braga Border Collie."
            />
         </Head>
         <Hero />
         <main className="container mx-auto px-4">
            <section aria-label="Seção filhotes" className="pt-52 xl:pt-12">
               <UpcomingSection />
            </section>
            <section aria-label="Seção pais" className="pt-12">
               <ParentsSection />
            </section>
            {/* <section aria-label="Seção sobre nós" className="pt-12">
               <AboutSection />
            </section>
            <section aria-label="Seção faq" className="pt-12 pb-12">
               <FaqSection />
            </section> */}
         </main>
      </>
   );
}
