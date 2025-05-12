"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "../store/storeHooks/useAuthStatus";
import { useEnhancedUser } from "../store/storeHooks/useEnhancedUser";

/**
 * Hook to protect routes based on user roles.
 * @param allowedRoles - Array of roles allowed to access the page.
 * @param redirectPath - Path to redirect if access is denied (default is "/licenses").
 * @returns void
 */
export function useProtectedRoute(
  allowedRoles: string[] = [],

  redirectPath: string = "/licenses"
) {
  const router = useRouter();
  const authStatus = useAuthStatus();
  console.log(authStatus, authStatus);
  const enhancedUser = useEnhancedUser();

  useEffect(() => {
    if (!authStatus) {
      router.push("/");
      return;
    }

    // User is authenticated, check user role
    if (authStatus && enhancedUser) {
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
    isAuthenticated: authStatus,
    // isLoading: authStatus === USER_AUTH_STATES.SIGNED_IN_STARTED,
    userRole: enhancedUser?.role,
  };
}
