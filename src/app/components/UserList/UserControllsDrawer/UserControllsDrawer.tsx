"use client";

import { Box, Drawer, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { COLOR_PURPLE } from "../../../utils/helpers/constants";
// import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteIcon from "@mui/icons-material/Delete";
import { User } from "../../../types/types";
import { useStore } from "../../../store/useStore";
import { useState } from "react";

interface UserControllsDrawerProps {
  user: User;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  isGroupAssigned: boolean;
}

const UserControllsDrawer = ({
  user,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,

  isGroupAssigned,
}: UserControllsDrawerProps) => {
  const [open, setOpen] = useState(false);

  const currentUser = useStore((state) => state.enhancedUser);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        height: "100%",
        width: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Box display="flex" flexDirection="column" gap="20px">
        <Box display="flex" alignItems="center" gap="10px">
          <IconButton
            onClick={() => setIsEditDialogOpen(true)}
            sx={{
              backgroundColor: `${COLOR_PURPLE}`,
              color: "white",
              ":hover": { color: `${COLOR_PURPLE}` },
            }}
          >
            <EditIcon />
          </IconButton>
          <Typography sx={{ cursor: "pointer" }} onClick={() => setIsEditDialogOpen(true)}>
            Edit
          </Typography>
        </Box>

        {/* <Box display="flex" alignItems="center" gap="10px">
          <IconButton
            onClick={setIsResetDialogOpen}
            sx={{
              backgroundColor: `${COLOR_PURPLE}`,
              color: "white",
              ":hover": { color: `${COLOR_PURPLE}` },
            }}
          >
            <LockResetIcon />
          </IconButton>
          <Typography sx={{ cursor: "pointer" }} onClick={setIsResetDialogOpen}>
            Reset Password
          </Typography>
        </Box> */}

        <Box display="flex" alignItems="center" gap="10px">
          <IconButton
            color="error"
            disabled={currentUser?.email === user.email || isGroupAssigned}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
          <Typography sx={{ cursor: "pointer" }} onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box display="flex">
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          borderRadius: "50%",
          backgroundColor: "#403C8C",
          color: "white",
          ":hover": { color: "#403C8C" },
        }}
      >
        <ExpandMore />
      </IconButton>
      <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default UserControllsDrawer;
