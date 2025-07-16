import { Variants, Transition } from "framer-motion";

interface FadeInProps {
   direction: "up" | "down" | "left" | "right";
   delay: number;
}

export const fadeIn = ({ direction, delay }: FadeInProps): Variants => {
   const transition: Transition = {
      type: "tween",
      duration: 1,
      delay,
      ease: [0.25, 0.25, 0.25, 0.75],
   };

   return {
      hidden: {
         y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
         x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
         opacity: 0,
      },
      show: {
         y: 0,
         x: 0,
         opacity: 1,
         transition,
      },
   };
};
