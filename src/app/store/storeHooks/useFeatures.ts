"use client";
import { useStore } from "../useStore";
import { useMemo } from "react";

export function useFeatures() {
  const features = useStore((state) => state.getFeatures());
  return useMemo(() => features, [features]);
}
