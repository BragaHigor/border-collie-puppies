import { Puppy } from "@/types";

export function filterPuppiesBySex(puppies: Puppy[], sex: string): Puppy[] {
   if (sex === "all") return puppies;
   return puppies.filter((p) => p.sex === sex);
}

export function sortByAvailability(puppies: Puppy[]): Puppy[] {
   return [...puppies].sort(
      (a, b) => (b.availability ? 1 : 0) - (a.availability ? 1 : 0),
   );
}
