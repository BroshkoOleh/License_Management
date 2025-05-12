// store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authSlice, AuthSliceT } from "./slices/authSlice";
import { usersSlice, UsersSliceT } from "./slices/usersSlice";
import { groupsSlice, GroupsSliceT } from "./slices/groupsSlice";
import { generalSlice, GeneralSliceT } from "./slices/generalSlice";

// Define the state type with only the userSlice
type MyState = AuthSliceT &
  UsersSliceT &
  GroupsSliceT &
  GeneralSliceT & {
    hasHydrated: boolean;
    setHydrated: (isHydrated: boolean) => void;
    logoutUser: () => void;
  };

// Create the store with only the userSlice
export const useStore = create<MyState>()(
  persist(
    (set, get, store) => ({
      ...authSlice(set, get, store),
      ...usersSlice(set, get, store),
      ...groupsSlice(set, get, store),
      ...generalSlice(set, get, store),
      hasHydrated: false,
      setHydrated: (isHydrated: boolean) => set({ hasHydrated: isHydrated }),
      logoutUser: () =>
        set({
          authStatus: false,
          authUser: null,
          enhancedUser: null,
          users: [],
          groups: [],
        }),
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
        authUser: state.authUser,
        enhancedUser: state.enhancedUser,
        users: state.users,
        groups: state.groups,
      }),
    }
  )
);
