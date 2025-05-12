"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useGroups() {
  const groups = useStore((state) => state.getGroups());
  return useMemo(() => groups, [groups]);
}
