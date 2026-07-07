"use client";

import {
   createContext,
   useContext,
   useState,
   useMemo,
   useCallback,
} from "react";
import {
   Puppy,
   PuppiesContextValue,
   PuppiesProviderProps,
   Filters,
   Parent,
   FaqItem,
} from "@/types";
import mockPuppies from "@/utils/mock/puppies-mock.json";
import mockParents from "@/utils/mock/parents-mock.json";
import mockFaq from "@/utils/mock/faq-mock.json";

const PuppiesContext = createContext<PuppiesContextValue | undefined>(
   undefined,
);

export function usePuppiesContext(): PuppiesContextValue {
   const ctx = useContext(PuppiesContext);
   if (!ctx) {
      throw new Error(
         "usePuppiesContext deve ser usado dentro de PuppiesProvider",
      );
   }
   return ctx;
}

export function PuppiesProvider({ children }: PuppiesProviderProps) {
   const [puppies] = useState<Puppy[]>(() => mockPuppies.puppies as Puppy[]);
   const [parents] = useState<Parent[]>(() => mockParents.parents as Parent[]);
   const [faqItems] = useState<FaqItem[]>(() => mockFaq.faqItems as FaqItem[]);

   const [showPuppiesList, setShowPuppiesList] = useState(false);
   const [selectedSex, setSelectedSex] = useState("");
   const [selectedColor, setSelectedColor] = useState("");
   const [appliedFilters, setAppliedFilters] = useState<Filters>({
      selectedSex: "",
      selectedColor: "",
   });

   const filteredPuppies = useMemo(() => {
      const sexFilter = (appliedFilters.selectedSex ?? "").toLowerCase().trim();
      const colorFilter = (appliedFilters.selectedColor ?? "")
         .toLowerCase()
         .trim();

      return puppies.filter((puppy) => {
         const matchesSex =
            sexFilter === "" ||
            sexFilter === "todos os sexos" ||
            puppy.sex.toLowerCase() === sexFilter;

         const matchesColor =
            colorFilter === "" ||
            colorFilter === "todas as cores" ||
            puppy.color.toLowerCase() === colorFilter;

         return matchesColor && matchesSex;
      });
   }, [appliedFilters.selectedColor, appliedFilters.selectedSex, puppies]);

   const handleSubmit = useCallback(() => {
      setShowPuppiesList(true);
      setAppliedFilters({
         selectedSex,
         selectedColor,
      });
   }, [selectedSex, selectedColor]);

   const handleClearSearch = useCallback(() => {
      setAppliedFilters({
         selectedSex: "",
         selectedColor: "",
      });
      setShowPuppiesList(false);
      setSelectedColor("");
      setSelectedSex("");
   }, []);

   const contextValue = useMemo<PuppiesContextValue>(
      () => ({
         puppies,
         parents,
         faqItems,
         filteredPuppies,
         isLoading: false,
         error: null,
         handleSubmit,
         handleClearSearch,
         showPuppiesList,
         selectedSex,
         setSelectedSex,
         selectedColor,
         setSelectedColor,
      }),
      [
         puppies,
         parents,
         faqItems,
         filteredPuppies,
         handleSubmit,
         handleClearSearch,
         showPuppiesList,
         selectedSex,
         selectedColor,
      ],
   );

   return (
      <PuppiesContext.Provider value={contextValue}>
         {children}
      </PuppiesContext.Provider>
   );
}
