"use client";

import Header from "../components/Header/Header";
import Box from "@mui/material/Box";
import Footer from "../components/Footer/Footer";
import { ReactNode } from "react";
import ClientProviders from "../components/ClientProviders/ClientProviders";

export default function App({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
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
    </ClientProviders>
  );
}
