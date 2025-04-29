"use client";
import { useState } from "react";

// import { useSnackbar } from "notistack";

// import { selectEnhancedUser } from "../../store/user/user.selector";
// import { signOutUser } from "../../utils/firebase/firebase-auth.utils";
// import {
//   updateEntry,
//   FIREBASE_COLLECTION_NAMES,
// } from "../../utils/firebase/firebase-firestore.utils";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import useHideOnScroll from "./useHideOnScroll";
import { useMediaQuery } from "@mui/material";
import HeaderNavDesktop from "./HeaderNavDesktop/HeaderNavDesktop";
import SignOutBtnMenu from "./SignOutBtnMenu/SignOutBtnMenu";
import MobileNavDrawer from "./MobileNavDrawer/MobileNavDrawer";

import Logo from "./Logo/Logo";
import { useStore } from "../../store/useStore";

// const drawerWidth = 240;

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const hide = useHideOnScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useStore((state) => state.enhancedUser);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <AppBar
        component="nav"
        position="fixed"
        style={{
          transform: hide ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease-in-out",
        }}
        sx={{ backgroundColor: "#403C8C" }}
      >
        <Toolbar>
          {currentUser ? (
            // SideBarBtn
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: isMobile ? "block" : "none" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography sx={{ flexGrow: 1, display: { xs: "block", sm: "none" } }}>
              LICENSE MANAGEMENT
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" width="100%">
            <Logo />

            {/* Header Navigation Full Screen */}
            {currentUser ? (
              <HeaderNavDesktop currentUser={currentUser} isMobile={isMobile} />
            ) : null}

            {/* SignOutMenu */}
            {currentUser ? <SignOutBtnMenu currentUser={currentUser} /> : null}
          </Box>
        </Toolbar>
      </AppBar>

      <MobileNavDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default Header;
