"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useLanguages() {
  const languages = useStore((state) => state.getLanguages());
  return useMemo(() => languages, [languages]);
}
