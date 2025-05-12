"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useUsers() {
  const users = useStore((state) => state.getUsers());
  return useMemo(() => users, [users]);
}
