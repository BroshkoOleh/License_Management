import { useState, useEffect, Fragment, ReactNode } from "react";

import Fab from "@mui/material/Fab";

interface FloatingActionButtonProps {
  handleClick: () => void;
  children: ReactNode;
}

const FloatingActionButton = ({ children, handleClick }: FloatingActionButtonProps) => {
  const [footerVisibleHeight, setFooterVisibleHeight] = useState(0);
  const [isFabVisible, setIsFabVisible] = useState(false);

  function getVisibleHeightOfFooter() {
    const footer = document.getElementById("footer"); // Make sure your footer has an 'id' attribute
    if (!footer) return 0;

    const rect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if the footer is visible
    if (rect.top < windowHeight) {
      // Footer is visible - calculate visible height
      return Math.min(rect.height, windowHeight - rect.top);
    }

    return 0; // Footer is not visible
  }

  useEffect(() => {
    const handleScroll = () => {
      const visibleHeight = getVisibleHeightOfFooter();
      setFooterVisibleHeight(visibleHeight);
    };

    const handleResize = () => {
      handleScroll(); // Recalculate on resize
    };

    // Initial calculation
    handleScroll();
    setIsFabVisible(true);

    // Add scroll and resize event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Add mutation observer to detect DOM changes
    const observer = new MutationObserver(() => {
      handleScroll();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Cleanup function to remove the event listeners and observer
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <Fragment>
      {isFabVisible && (
        <Fab
          color="primary"
          sx={{
            backgroundColor: "#403C8C",
            color: "white",
            ":hover": { color: "#403C8C", backgroundColor: "gainsboro" },
            margin: 0,
            right: 20,
            bottom: 20 + footerVisibleHeight,
            position: "fixed",
          }}
          onClick={handleClick}
        >
          {children}
        </Fab>
      )}
    </Fragment>
  );
};

export default FloatingActionButton;
