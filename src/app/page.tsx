import { AboutSection } from "@/components/sections/About/About";
import { FaqSection } from "@/components/sections/Faq/Faq";
import { Hero } from "@/components/sections/Hero/Hero";
import { ParentsSection } from "@/components/sections/Parents/Parents";
import { UpcomingSection } from "@/components/sections/Upcoming/Upcoming";

export default function Home() {
   return (
      <>
         <Hero />
         <main className="container mx-auto px-4">
            <section>
               <UpcomingSection />
            </section>
            <section>
               <ParentsSection />
            </section>
            <section>
               <AboutSection />
            </section>
            <section>
               <FaqSection />
            </section>
         </main>
      </>
   );
}
