import { StateCreator } from "zustand";

import { Feature } from "../../types/types";

// Define the type for the user slice
export interface FeaturesSliceT {
  features: Feature[];
  setFeatures: (data: Feature[]) => void;
  getFeatures: () => Feature[];
}

// Create the slice
export const featuresSlice: StateCreator<FeaturesSliceT> = (set, get) => ({
  features: [],

  setFeatures: (data) => set({ features: data }),
  getFeatures: () => get().features,
});
