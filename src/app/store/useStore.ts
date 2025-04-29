// store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userSlice, UserSliceT } from "./slices/userSlice";

// Define the state type with only the userSlice
type MyState = UserSliceT & {
  hasHydrated: boolean;
  setHydrated: (isHydrated: boolean) => void;
};

// Create the store with only the userSlice
export const useStore = create<MyState>()(
  persist(
    (set, get, store) => ({
      ...userSlice(set, get, store),
      hasHydrated: false,
      setHydrated: (isHydrated: boolean) => set({ hasHydrated: isHydrated }),
    }),
    {
      name: "my-app-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
      partialize: (state) => ({
        authStatus: state.authStatus,
        user: state.user,
        enhancedUser: state.enhancedUser,
      }),
    }
  )
);
