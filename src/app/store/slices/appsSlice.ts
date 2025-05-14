import { StateCreator } from "zustand";

import { AppType } from "../../types/types";

// Define the type for the user slice
export interface AppsSliceT {
  apps: AppType[];
  setApps: (data: AppType[]) => void;
  getApps: () => AppType[];
}

// Create the slice
export const appsSlice: StateCreator<AppsSliceT> = (set, get) => ({
  apps: [],

  setApps: (data) => set({ apps: data }),
  getApps: () => get().apps,
});
