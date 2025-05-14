import { useState } from "react";
import { useSnackbar } from "notistack";
// import { selectConfigurations } from "../../store/configurations/configurations.selector";
import {
  getCollection,
  deleteEntry,
  FIREBASE_COLLECTION_NAMES,
} from "../../../utils/firebase/firebaseFirestore";

import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";

import AppEditDialog from "../AppEditDialog/AppEditDialog";
import ConfirmDeclineDialog from "../../ConfirmDeclineDialog/ConfirmDeclineDialog";

import { COLOR_PURPLE } from "../../../utils/helpers/constants";
import { useWindowWidth } from "../../../hooks/useWindowWidth";
import { AppType } from "../../../types/types";
import { useStore } from "@/app/store/useStore";

interface FeatureListItemProps {
  app: AppType;
}

const AppListItem = ({ app }: FeatureListItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const windowWidth = useWindowWidth();
  const setApps = useStore((state) => state.setApps);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const allConfigurations = useSelector(selectConfigurations);
  // const isAssigned =
  //   allConfigurations.filter((configuration) => {
  //     return configuration.enabledAppIds.includes(app.id);
  //   }).length > 0;

  //Controlls

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
      deleteEntry(FIREBASE_COLLECTION_NAMES.APPS, app.id);
      enqueueSnackbar(`App "${app.appName}" was successfully deleted.`, {
        variant: "success",
      });

      const newApps = await getCollection<AppType>(FIREBASE_COLLECTION_NAMES.APPS);
      setApps(newApps);

      closeDeleteDialog();
    } catch (error) {
      enqueueSnackbar(`Failed to delete the app "${app.appName}". Please try again.`, {
        variant: "error",
      });
      console.log("app deletion failed: ", error);
    }
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
              {app.appName[0]}
            </Avatar>
          </ListItemAvatar>
        )}
        {windowWidth > 520 ? (
          <ListItemText primary={app.appName} secondary={app.uuid} />
        ) : (
          <ListItemText
            sx={{ display: "flex", flexDirection: "column" }}
            primary={app.appName}
            secondary={app.uuid}
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
            // disabled={isAssigned}
            onClick={openDeleteDialog}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <AppEditDialog open={isEditDialogOpen} handleClose={closeEditDialog} app={app} />
      <ConfirmDeclineDialog
        open={isDeleteDialogOpen}
        dialogTitle="Delete App"
        dialogText="Are you sure that you want to delete this app? The operation cannot be undone."
        confirmText="Confirm"
        declineText="Cancel"
        handleConfirmAction={handleDelete}
        handleDeclineAction={closeDeleteDialog}
      />
    </Paper>
  );
};

export default AppListItem;
