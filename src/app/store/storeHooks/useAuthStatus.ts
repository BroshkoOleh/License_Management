"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useAuthStatus() {
  const authStatus = useStore((state) => state.getAuthStatus());
  return useMemo(() => authStatus, [authStatus]);
}
