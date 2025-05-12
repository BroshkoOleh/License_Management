"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useAuthUser() {
  const authUser = useStore((state) => state.getAuthUser());
  return useMemo(() => authUser, [authUser]);
}
