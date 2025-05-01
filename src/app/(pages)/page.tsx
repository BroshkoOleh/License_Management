"use client";
import { useEffect } from "react";
import { onAuthStateChangedListener } from "../utils/firebase/firebaseAuth";
import { User } from "firebase/auth";
import Auth from "../components/Authentication/Auth/Auth";
import { useStore } from "../store/useStore";
import { USER_AUTH_STATES } from "../utils/helpers/constants";
import {
  FIREBASE_COLLECTION_NAMES,
  getEntry,
  getCollection,
  onCollectionChangedListener,
} from "../utils/firebase/firebaseFirestore";
import LoadingSpinner from "../components/Loading/LoadingSpinner/LoadingSpinner";
// Auth User

// export const USER_AUTH_STATES = {
//   UNKNOWN: 'UNKNOWN',
//   SIGNED_IN_STARTED: 'SIGNED_IN_STARTED',
//   SIGNED_IN_FINISHED: 'SIGNED_IN_FINISHED',
//   SIGNED_OUT: 'SIGNED_OUT',
// }

export default function Home() {
  const authStatus = useStore((state) => state.authStatus);
  const authUser = useStore((state) => state.user);
  const enhancedUser = useStore((state) => state.enhancedUser);
  const setAuthStatus = useStore((state) => state.setAuthStatus);
  const setUser = useStore((state) => state.setUser);
  const logoutUser = useStore((state) => state.logoutUser);
  const setEnhancedUser = useStore((state) => state.setEnhancedUser);

  console.log("authStatus", authStatus);
  console.log("authUser", authUser);
  console.log("enhancedUser", enhancedUser);

  useEffect(() => {
    const unsub = onAuthStateChangedListener((user: User | null) => {
      console.log("user////////////////////////////", user);
      if (user) {
        setUser(user, USER_AUTH_STATES.SIGNED_IN_STARTED);
      } else {
        logoutUser(USER_AUTH_STATES.SIGNED_OUT);
      }
    });
    return () => unsub();
  }, []);

  console.log("authStatus after first useEffect in  home", authStatus);

  // Enhanced User
  useEffect(() => {
    if (
      authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED ||
      authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED
    ) {
      const getCurrentUser = async () => {
        if (authUser && authUser.email) {
          const userData = await getEntry(FIREBASE_COLLECTION_NAMES.USERS, authUser.email);
          const enhancedUserData = userData
            ? {
                displayName: userData.displayName || "",
                role: userData.role || "",
              }
            : null;
          setEnhancedUser(enhancedUserData, USER_AUTH_STATES.SIGNED_IN_FINISHED);
        }
      };
      getCurrentUser();
      const unsub = onCollectionChangedListener(FIREBASE_COLLECTION_NAMES.USERS, () =>
        getCurrentUser()
      );
      return () => unsub();
    }
  }, [authUser, authStatus]);

  return authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED ? <LoadingSpinner /> : <Auth />;
}
