"use client";

import { useState } from "react";

import { useSnackbar } from "notistack";

import { deleteUser } from "../../../utils/firebase/firebaseFunction";
import {
  getCollection,
  deleteEntry,
  FIREBASE_COLLECTION_NAMES,
} from "../../../utils/firebase/firebaseFirestore";
import { Box, Chip, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import UserEditDialog from "../UserEditDialog/UserEditDialog";
import ConfirmDeclineDialog from "../../ConfirmDeclineDialog/ConfirmDeclineDialog";

import { COLOR_PURPLE, USER_ROLE } from "../../../utils/helpers/constants";
import UserControllsDrawer from "../UserControllsDrawer/UserControllsDrawer";
import { useWindowWidth } from "../../../hooks/useWindowWidth";
import { User } from "../../../types/types";
import { useStore } from "../../../store/useStore";

interface UserListItemProps {
  user: User;
}

const UserListItem = ({ user }: UserListItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const windowWidth = useWindowWidth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const allGroup = useStore((state) => state.groups);
  const currentUser = useStore((state) => state.enhancedUser);
  const setUsers = useStore((state) => state.setUsers);

  const { displayName, email, role } = user;

  const isGroupAssigned = allGroup.some((group) => group.userEmails.includes(email));

  const chipStyle = {
    height: "18px",
    fontSize: "0.6rem",
    borderRadius: "16px",
    padding: "1px 1px",
  };

  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleteDialogOpen(false);

      // Auth
      await deleteUser(email);

      // Firestore
      deleteEntry(FIREBASE_COLLECTION_NAMES.USERS, email);

      const newUsers = await getCollection<User>(FIREBASE_COLLECTION_NAMES.USERS);
      setUsers(newUsers);

      enqueueSnackbar(`User "${user.email}" was successfully deleted.`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`Failed to delete the user "${user.email}". Please try again.`, {
        variant: "error",
      });
      console.log("user deletion failed: ", error);
    }
  };

  return (
    <Paper
      component="div"
      sx={{
        mb: 1,
        borderRadius: "16px",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: "100%",
        "@media (max-width: 600px)": {
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "8px",
        },
      }}
    >
      <ListItem sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        {windowWidth > 520 && (
          <ListItemAvatar>
            <Avatar
              style={{
                backgroundColor: `${COLOR_PURPLE}`,
              }}
            >
              {displayName ? displayName[0] : ""}
            </Avatar>
          </ListItemAvatar>
        )}
        {windowWidth > 520 ? (
          <ListItemText
            sx={{ wordBreak: "break-word" }}
            primary={
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <span>{displayName}</span>
                {role === USER_ROLE.ADMIN ? (
                  <Chip
                    size="small"
                    label={"Admin"}
                    sx={{
                      ...chipStyle,
                      marginLeft: "10px",
                      color: "white",
                      backgroundColor: "red",
                    }}
                  />
                ) : role === USER_ROLE.EDITOR ? (
                  <Chip
                    size="small"
                    label={"Editor"}
                    sx={{
                      ...chipStyle,
                      marginLeft: "10px",
                      color: "white",
                      backgroundColor: `${COLOR_PURPLE}`,
                    }}
                  />
                ) : (
                  <Chip
                    size="small"
                    label={"Viewer"}
                    color="success"
                    sx={{
                      ...chipStyle,
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </div>
            }
            secondary={email}
          />
        ) : (
          <Box
            sx={{
              wordBreak: "break-word",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography>{displayName}</Typography>
            </Box>
            <Box>
              {role === USER_ROLE.ADMIN ? (
                <Chip
                  size="small"
                  label={"Admin"}
                  sx={{
                    ...chipStyle,
                    color: "white",
                    backgroundColor: "red",
                  }}
                />
              ) : role === USER_ROLE.EDITOR ? (
                <Chip
                  size="small"
                  label={"Editor"}
                  sx={{
                    ...chipStyle,
                    color: "white",
                    backgroundColor: `${COLOR_PURPLE}`,
                  }}
                />
              ) : (
                <Chip
                  size="small"
                  label={"Viewer"}
                  color="success"
                  sx={{
                    ...chipStyle,
                    color: "white",
                  }}
                />
              )}
            </Box>
            <Typography color="rgba(0, 0, 0, 0.6)" fontSize="14px">
              {email}
            </Typography>
          </Box>
        )}

        {windowWidth > 900 ? (
          <Box display="flex" gap="10px">
            <IconButton
              onClick={openEditDialog}
              sx={{
                backgroundColor: "#403C8C",
                color: "white",
                ":hover": { color: "#403C8C" },
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              disabled={currentUser?.email === email || isGroupAssigned}
              onClick={openDeleteDialog}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <UserControllsDrawer
              isGroupAssigned={isGroupAssigned}
              user={user}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
          </Box>
        )}
      </ListItem>
      <UserEditDialog open={isEditDialogOpen} handleClose={closeEditDialog} user={user} />

      <ConfirmDeclineDialog
        open={isDeleteDialogOpen}
        dialogTitle="Delete User"
        dialogText="Are you sure that you want to delete this user? This operation cannot be undone."
        confirmText="Confirm"
        declineText="Cancel"
        handleConfirmAction={handleDelete}
        handleDeclineAction={closeDeleteDialog}
      />
    </Paper>
  );
};

export default UserListItem;
