"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { USER_AUTH_STATES } from "../utils/helpers/constants";
import { useAuthStatus } from "../store/storeHooks/useAuthStatus";
import { useEnhancedUser } from "../store/storeHooks/useEnhancedUser";

/**
 * Hook to protect routes based on user roles.
 * @param allowedRoles - Array of roles allowed to access the page.
 * @param redirectPath - Path to redirect if access is denied (default is "/licenses").
 * @returns void
 */
export function useProtectedRoute(allowedRoles: string[] = [], redirectPath: string = "/licenses") {
  const router = useRouter();
  const authStatus = useAuthStatus();
  console.log(authStatus, authStatus);
  const enhancedUser = useEnhancedUser();

  useEffect(() => {
    // Check if authentication state is still unknown
    if (authStatus === USER_AUTH_STATES.UNKNOWN) {
      // State is still unknown, waiting
      return;
    }

    // Redirect to main page if user is not authenticated
    if (authStatus === USER_AUTH_STATES.SIGNED_OUT) {
      router.push("/");
      return;
    }

    // Wait for authentication process to finish
    if (authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED) {
      // Authentication process is ongoing, waiting
      return;
    }

    // User is authenticated, check user role
    if (authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED && enhancedUser) {
      const userRole = enhancedUser.role;

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to default page if access is denied
        router.push(redirectPath);
      }
    }
  }, [authStatus, enhancedUser, allowedRoles, redirectPath, router]);

  // Return authentication state for ease of use
  return {
    isAuthenticated: authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED,
    isLoading: authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED,
    userRole: enhancedUser?.role,
  };
}
