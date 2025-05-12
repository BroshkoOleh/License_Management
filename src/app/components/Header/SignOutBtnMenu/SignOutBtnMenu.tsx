"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Avatar, Menu, MenuItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useState, memo } from "react";
import { User } from "../../../types/types";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useStore } from "../../../store/useStore";
import { USER_AUTH_STATES } from "../../../utils/helpers/constants";

import { signOutUser } from "../../../utils/firebase/firebaseAuth";
interface SignOutMenuProps {
  currentUser: User;
}
function SignOutBtnMenu({ currentUser }: SignOutMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const logoutUser = useStore((state) => state.logoutUser);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      logoutUser(USER_AUTH_STATES.SIGNED_OUT);
      router.push("/");

      enqueueSnackbar("You have successfully signed out.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Sign out failed. Please try again.", {
        variant: "error",
      });
      console.log("sign out failed: ", error);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={handleMenuOpen}
        style={{
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton component="div" sx={{ color: "#fff" }}>
          <Avatar />
        </IconButton>
        <Typography sx={{ color: "#fff", mr: 2, cursor: "pointer" }}>
          {currentUser.displayName}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock={true}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>{`Status: ${currentUser.role}`}</MenuItem>
        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
export default memo(SignOutBtnMenu);
