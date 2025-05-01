"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { COLOR_PURPLE } from "../../../utils/helpers/constants";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress style={{ color: COLOR_PURPLE }} disableShrink />
    </Box>
  );
};

export default LoadingSpinner;
