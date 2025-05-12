import { StateCreator } from "zustand";

import { User } from "../../types/types";

// Define the type for the user slice
export interface AuthSliceT {
  authStatus: string;
  authUser: string | null;
  enhancedUser: User | null;

  setAuthStatus: (status: string) => void;
  getAuthStatus: () => string;
  setAuthUser: (user: string | null, status: string) => void;
  getAuthUser: () => string | null;
  setEnhancedUser: (enhancedUser: User | null, status: string) => void;
  getEnhancedUser: () => User | null;
}

// Create the slice
export const authSlice: StateCreator<AuthSliceT> = (set, get) => ({
  authStatus: "UNKNOWN",
  authUser: null,
  enhancedUser: null,

  setAuthStatus: (status) => set({ authStatus: status }),
  getAuthStatus: () => get().authStatus,

  setAuthUser: (authUser, status) =>
    set({
      authUser,
      authStatus: status,
    }),
  getAuthUser: () => get().authUser,

  setEnhancedUser: (enhancedUser, status) =>
    set({
      enhancedUser,
      authStatus: status,
    }),
  getEnhancedUser: () => get().enhancedUser,
});
