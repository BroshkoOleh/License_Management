import { StateCreator } from "zustand";

import { Language } from "../../types/types";

// Define the type for the user slice
export interface LanguagesSliceT {
  languages: Language[];
  setLanguages: (data: Language[]) => void;
  getLanguages: () => Language[];
}

// Create the slice
export const languagesSlice: StateCreator<LanguagesSliceT> = (set, get) => ({
  languages: [],

  setLanguages: (data) => set({ languages: data }),
  getLanguages: () => get().languages,
});
