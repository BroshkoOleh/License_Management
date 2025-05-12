"use client";

import { useAuthStatus } from "../store/storeHooks/useAuthStatus";
import Auth from "../components/Authentication/Auth/Auth";
import { useStore } from "../store/useStore";
import { USER_AUTH_STATES } from "../utils/helpers/constants";
import LoadingSpinner from "../components/Loading/LoadingSpinner/LoadingSpinner";

// Auth User

export default function Home() {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const authStatus = useAuthStatus();

  if (!hasHydrated) {
    return <div></div>;
  }

  return authStatus ? <LoadingSpinner /> : <Auth />;
}
