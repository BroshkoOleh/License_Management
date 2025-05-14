"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useApps() {
  const apps = useStore((state) => state.getApps());
  return useMemo(() => apps, [apps]);
}
