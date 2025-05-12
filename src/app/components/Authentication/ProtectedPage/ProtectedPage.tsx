"use client";
import { USER_ROLE } from "../../../utils/helpers/constants";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner/LoadingSpinner";
import { useStore } from "../../../store/useStore";
import { useAuthStatus } from "@/app/store/storeHooks/useAuthStatus";
import { useEffect, useState } from "react";
import { useEnhancedUser } from "@/app/store/storeHooks/useEnhancedUser";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedPageProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedPage({ children, allowedRoles }: ProtectedPageProps) {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const authStatus = useAuthStatus();
  const enhancedUser = useEnhancedUser();

  useEffect(() => {
    if (!authStatus) {
      redirect("/");
    }

    // User is authenticated, check user role
    if (authStatus && enhancedUser) {
      const userRole = enhancedUser.role;

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to default page if access is denied
        redirect("/licenses");
      }
    }
  }, []);

  if (!hasHydrated) {
    return <LoadingSpinner />;
  }

  return !authStatus && enhancedUser?.role !== USER_ROLE.ADMIN && !hasHydrated ? (
    <LoadingSpinner />
  ) : (
    <div>{children}</div>
  );
}
