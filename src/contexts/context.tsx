"use client";

import {
   createContext,
   useEffect,
   useState,
   useMemo,
   useCallback,
} from "react";
import {
   Puppy,
   PuppiesContextValue,
   PuppiesProviderProps,
   Filters,
} from "@/types";
import mockData from "@/utils/mock/db.json";

export const PuppiesContext = createContext<PuppiesContextValue>(
   {} as PuppiesContextValue
);

export function PuppiesProvider({ children }: PuppiesProviderProps) {
   const [puppies, setPuppies] = useState<Puppy[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [showPuppiesList, setShowPuppiesList] = useState<boolean>(false);

   const [selectedSex, setSelectedSex] = useState<string>("");
   const [selectedColor, setSelectedColor] = useState<string>("");

   const [appliedFilters, setAppliedFilters] = useState<Filters>({
      selectedSex: "",
      selectedColor: "",
   });

   useEffect(() => {
      setIsLoading(true);
      try {
         setPuppies(mockData.puppies as Puppy[]);
         setError(null);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
         setError("Erro ao carregar dados do mock");
      } finally {
         setIsLoading(false);
      }
   }, []);

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
      setIsLoading(true);
      setShowPuppiesList(true);
      setAppliedFilters({
         selectedSex,
         selectedColor,
      });
      setIsLoading(false);
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
         filteredPuppies,
         isLoading,
         error,
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
         filteredPuppies,
         isLoading,
         error,
         handleSubmit,
         handleClearSearch,
         showPuppiesList,
         selectedSex,
         setSelectedSex,
         selectedColor,
         setSelectedColor,
      ]
   );

   return (
      <PuppiesContext.Provider value={contextValue}>
         {children}
      </PuppiesContext.Provider>
   );
}
