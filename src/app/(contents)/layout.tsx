import { Hero } from "@/components/sections/Hero/Hero";

export default function ArticlesLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <>
         <Hero />
         {children}
      </>
   );
}
