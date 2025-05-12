import { StateCreator } from "zustand";

import { User } from "../../types/types";

// Define the type for the user slice
export interface UsersSliceT {
  users: User[];
  setUsers: (data: User[]) => void;
  getUsers: () => User[];
}

// Create the slice
export const usersSlice: StateCreator<UsersSliceT> = (set, get) => ({
  users: [],

  setUsers: (data) => set({ users: data }),
  getUsers: () => get().users,
});
