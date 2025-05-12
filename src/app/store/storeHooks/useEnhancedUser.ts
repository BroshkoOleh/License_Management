"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useEnhancedUser() {
  const EnhancedUser = useStore((state) => state.getEnhancedUser());
  return useMemo(() => EnhancedUser, [EnhancedUser]);
}
