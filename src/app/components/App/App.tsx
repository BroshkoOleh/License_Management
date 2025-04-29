"use client";

import Header from "../Header/Header";
import Box from "@mui/material/Box";
import Footer from "../Footer/Footer";
import { ReactNode } from "react";

export default function App({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: "68px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
