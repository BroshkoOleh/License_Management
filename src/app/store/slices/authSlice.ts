import { StateCreator } from "zustand";

import { User } from "../../types/types";

// Define the type for the user slice
export interface AuthSliceT {
  authStatus: boolean;
  authUser: string | null;
  enhancedUser: User | null;

  setAuthStatus: (status: boolean) => void;
  getAuthStatus: () => boolean;
  setAuthUser: (user: string | null) => void;
  getAuthUser: () => string | null;
  setEnhancedUser: (enhancedUser: User | null) => void;
  getEnhancedUser: () => User | null;
}

// Create the slice
export const authSlice: StateCreator<AuthSliceT> = (set, get) => ({
  authStatus: false,
  authUser: null,
  enhancedUser: null,

  setAuthStatus: (status) => set({ authStatus: status }),
  getAuthStatus: () => get().authStatus,

  setAuthUser: (authUser) =>
    set({
      authUser,
    }),
  getAuthUser: () => get().authUser,

  setEnhancedUser: (enhancedUser) =>
    set({
      enhancedUser,
      authStatus: true,
    }),
  getEnhancedUser: () => get().enhancedUser,
});
