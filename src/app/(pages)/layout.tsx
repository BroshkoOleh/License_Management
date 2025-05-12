"use client";

import Header from "../components/Header/Header";
import Box from "@mui/material/Box";
import Footer from "../components/Footer/Footer";
import { ReactNode } from "react";
import ClientProviders from "../components/ClientProviders/ClientProviders";
import { useEffect } from "react";
import { onAuthStateChangedListener } from "../utils/firebase/firebaseAuth";
import { useAuthStatus } from "../store/storeHooks/useAuthStatus";
import { useAuthUser } from "../store/storeHooks/useAuthUser";

import { useStore } from "../store/useStore";
import { USER_AUTH_STATES } from "../utils/helpers/constants";
import {
  FIREBASE_COLLECTION_NAMES,
  getEntry,
  getCollection,
  onCollectionChangedListener,
} from "../utils/firebase/firebaseFirestore";
import LoadingSpinner from "../components/Loading/LoadingSpinner/LoadingSpinner";
import { User, Group } from "../types/types";
import { getAuth } from "firebase/auth";

export default function App({ children }: { children: ReactNode }) {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const authStatus = useAuthStatus();
  const authUser = useAuthUser();
  const logoutUser = useStore((state) => state.logoutUser);
  const setAuthUser = useStore((state) => state.setAuthUser);
  const setEnhancedUser = useStore((state) => state.setEnhancedUser);
  const setUsers = useStore((state) => state.setUsers);
  const setGroups = useStore((state) => state.setGroups);

  useEffect(() => {
    const unsub = onAuthStateChangedListener((user) => {
      if (user) {
        setAuthUser(user?.email, USER_AUTH_STATES.SIGNED_IN_STARTED);
      } else {
        logoutUser(USER_AUTH_STATES.SIGNED_OUT);
      }
    });
    return () => unsub();
  }, []);

  // Enhanced User
  useEffect(() => {
    if (
      authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED ||
      authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED
    ) {
      const getCurrentUser = async () => {
        if (authUser) {
          const userData = await getEntry<User>(FIREBASE_COLLECTION_NAMES.USERS, authUser);

          userData ? setEnhancedUser(userData, USER_AUTH_STATES.SIGNED_IN_FINISHED) : null;
        }
      };
      getCurrentUser();
      const unsub = onCollectionChangedListener(FIREBASE_COLLECTION_NAMES.USERS, () =>
        getCurrentUser()
      );
      return () => unsub();
    }
  }, [authUser, authStatus]);

  // Users
  useEffect(() => {
    if (
      authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED ||
      authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED
    ) {
      const getUsers = async () => {
        try {
          const users = await getCollection<User>(FIREBASE_COLLECTION_NAMES.USERS);
          setUsers(users);
        } catch (error) {
          console.error("Помилка при отриманні користувачів:", error);
        }
      };
      getUsers();

      const getGroups = async () => {
        const groups = await getCollection<Group>(FIREBASE_COLLECTION_NAMES.GROUPS);

        setGroups(groups);
      };
      getGroups();
    }
  }, [authStatus]);

  // Groups
  // useEffect(() => {
  //   if (
  //     authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED ||
  //     authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED
  //   ) {
  //     const getGroups = async () => {
  //       const groups = await getCollection<Group>(FIREBASE_COLLECTION_NAMES.GROUPS);

  //       setGroups(groups);
  //     };
  //     getGroups();
  //     const unsub = onCollectionChangedListener(FIREBASE_COLLECTION_NAMES.GROUPS, () =>
  //       getGroups()
  //     );
  //     return () => unsub();
  //   }
  // }, [authStatus]);

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <ClientProviders>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />

        <Box
          sx={{
            flexGrow: 1,
            paddingTop: "68px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </ClientProviders>
  );
}
