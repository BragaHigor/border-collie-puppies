import { Dispatch, ReactNode, SetStateAction } from "react";

export interface Images {
   img_sm: string;
   img_lg: string;
   gallery: string[];
}

export interface Puppy {
   id: string;
   name: string;
   sex: "macho" | "fêmea";
   color: string;
   dateOfBirth: string;
   images: Images;
   availability: boolean;
}

export interface PuppiesContextValue {
   puppies: Puppy[];
   filteredPuppies: Puppy[];
   isLoading: boolean;
   error: string | null;
   handleSubmit: () => void;
   handleClearSearch: () => void;
   showPuppiesList: boolean;
   selectedSex: string;
   setSelectedSex: Dispatch<SetStateAction<string>>;
   selectedColor: string;
   setSelectedColor: Dispatch<SetStateAction<string>>;
   filterBySex: (sex: string) => Puppy[];
}

export interface PuppiesProviderProps {
   children: ReactNode;
}

export interface Filters {
   selectedSex: string;
   selectedColor: string;
}
