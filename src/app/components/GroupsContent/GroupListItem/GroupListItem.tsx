import { useState, FormEvent } from "react";
import { useSnackbar } from "notistack";
import {
  deleteEntry,
  FIREBASE_COLLECTION_NAMES,
  getCollection,
} from "../../../utils/firebase/firebaseFirestore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupEditDialog from "../GroupEditDialog/GroupEditDialog";
import ConfirmDeclineDialog from "../../ConfirmDeclineDialog/ConfirmDeclineDialog";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";
import React from "react";
import { COLOR_PURPLE, EMAILER_URL, USER_ROLE } from "../../../utils/helpers/constants";
import { useWindowWidth } from "../../../hooks/useWindowWidth";
import { Group, User } from "../../../types/types";
import { useUsers } from "@/app/store/storeHooks/useUsers";
import { useStore } from "@/app/store/useStore";

interface GroupListItemProps {
  group: Group;
}

const GroupListItem = ({ group }: GroupListItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const windowWidth = useWindowWidth();
  const setGroups = useStore((state) => state.setGroups);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { groupName, userEmails } = group;

  //Config
  //   const allConfiguration = useSelector(selectConfigurations);
  //   const assignedConfiguration = allConfiguration.find((config) => config.groupId === group.id);
  //   const isAssignedToConfig = assignedConfiguration ? true : false;

  // Assigned Users
  const allUsers = useUsers();
  const assignedUserEmails = allUsers.reduce<string[]>((acc, user) => {
    if (userEmails.includes(user.email)) {
      acc.push(user.email);
    }
    return acc;
  }, []);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteEntry(FIREBASE_COLLECTION_NAMES.GROUPS, group.id);

      const newGroups = await getCollection<Group>(FIREBASE_COLLECTION_NAMES.GROUPS);
      setGroups(newGroups);

      enqueueSnackbar(`Group "${group.groupName}" was successfully deleted.`, {
        variant: "success",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(`Failed to delete the group "${groupName}". Please try again.`, {
        variant: "error",
      });
      console.log("group deletion failed: ", error);
    }
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

  return (
    <Paper
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
      elevation={1}
    >
      <ListItem>
        {windowWidth > 520 && (
          <ListItemAvatar>
            <Avatar
              style={{
                backgroundColor: `${COLOR_PURPLE}`,
              }}
            >
              {groupName[0]}
            </Avatar>
          </ListItemAvatar>
        )}
        {windowWidth > 520 ? (
          <ListItemText
            sx={{ wordBreak: "break-word" }}
            primary={groupName}
            secondary={assignedUserEmails.join(", ")}
          />
        ) : (
          <ListItemText
            sx={{ display: "flex", flexDirection: "column" }}
            primary={groupName}
            secondary={assignedUserEmails.join(", ")}
          />
        )}
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
            onClick={openDeleteDialog}
            //   disabled={isAssignedToConfig}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <GroupEditDialog open={isEditDialogOpen} handleClose={closeEditDialog} group={group} />
      <ConfirmDeclineDialog
        open={isDeleteDialogOpen}
        dialogTitle="Delete Group"
        dialogText="Are you sure that you want to delete this group? This operation cannot be undone."
        confirmText="Confirm"
        declineText="Cancel"
        handleConfirmAction={handleDelete}
        handleDeclineAction={closeDeleteDialog}
      />
    </Paper>
  );
};

export default GroupListItem;
