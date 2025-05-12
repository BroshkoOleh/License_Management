import { StateCreator } from "zustand";

// Define the type for the user slice
export interface GeneralSliceT {
  searchString: string;

  setSearchString: (value: string) => void;
  getSearchString: () => string;
}

// Create the slice
export const generalSlice: StateCreator<GeneralSliceT> = (set, get) => ({
  searchString: "",

  setSearchString: (value) => set({ searchString: value }),
  getSearchString: () => get().searchString,
});
