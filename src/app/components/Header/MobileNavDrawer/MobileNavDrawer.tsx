import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import NavigationMenuContent from "../NavigationMenuContent/NavigationMenuContent";
import { CurrentUserType } from "../../../types/types";
import { memo } from "react";

interface MobileNavDrawerProps {
  mobileOpen: boolean;
  isMobile: boolean;
  handleDrawerToggle: () => void;
  currentUser: CurrentUserType;
}

function MobileNavDrawer({
  mobileOpen,
  handleDrawerToggle,
  isMobile,
  currentUser,
}: MobileNavDrawerProps) {
  const drawerWidth = 240;
  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: isMobile ? "block" : "none",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {/* Mobile SideBarMenu */}
        <NavigationMenuContent currentUser={currentUser} handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </Box>
  );
}

export default memo(MobileNavDrawer);
