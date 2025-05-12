import { StateCreator } from "zustand";

import { Group } from "../../types/types";

// Define the type for the user slice
export interface GroupsSliceT {
  groups: Group[];

  setGroups: (data: Group[]) => void;
  getGroups: () => Group[];
}

// Create the slice
export const groupsSlice: StateCreator<GroupsSliceT> = (set, get) => ({
  groups: [],

  setGroups: (data) => set({ groups: data }),
  getGroups: () => get().groups,
});
