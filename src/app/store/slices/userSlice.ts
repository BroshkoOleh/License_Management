import { StateCreator } from "zustand";

// Define the type for the user slice
export interface UserSliceT {
  authStatus: string;
  user: { email: string | null } | null;
  enhancedUser: { displayName: string; role: "Admin" | "Editor" | "Viewer" } | null;
  setAuthStatus: (status: string) => void;
  setUser: (user: { email: string | null } | null, status: string) => void;
  setEnhancedUser: (
    enhancedUser: { displayName: string; role: "Admin" | "Editor" | "Viewer" } | null,
    status: string
  ) => void;
  logoutUser: (status: string) => void;
}

// Create the slice
export const userSlice: StateCreator<UserSliceT> = (set) => ({
  authStatus: "UNKNOWN",
  user: null,
  enhancedUser: null,

  setAuthStatus: (status) => set({ authStatus: status }),

  setUser: (user, status) =>
    set({
      user,
      authStatus: status,
    }),

  setEnhancedUser: (enhancedUser, status) =>
    set({
      enhancedUser,
      authStatus: status,
    }),

  logoutUser: (status) =>
    set({
      user: null,
      enhancedUser: null,
      authStatus: status,
    }),
});
