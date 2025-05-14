import { StateCreator } from "zustand";

import { Group } from "../../types/types";

// Define the type for the user slice
export interface GroupsSliceT {
  groups: Group[];
  groupsListSearchString: string;

  setGroups: (data: Group[]) => void;
  getGroups: () => Group[];

  setGroupsListSearchString: (value: string) => void;
  getGroupsListSearchString: () => string;
}

// Create the slice
export const groupsSlice: StateCreator<GroupsSliceT> = (set, get) => ({
  groups: [],
  groupsListSearchString: "",

  setGroups: (data) => set({ groups: data }),
  getGroups: () => get().groups,

  setGroupsListSearchString: (value) =>
    set({
      groupsListSearchString: value,
    }),
  getGroupsListSearchString: () => get().groupsListSearchString,
});
