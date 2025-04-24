"use client";

import { useScrollTrigger } from "@mui/material";
import { useState, useEffect } from "react";

const useHideOnScroll = () => {
  const trigger = useScrollTrigger();
  const [hide, setHide] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setHide(true);
      } else {
        setHide(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return hide;
};

export default useHideOnScroll;
