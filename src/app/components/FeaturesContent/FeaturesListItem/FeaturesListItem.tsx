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

import FeaturesEditDialog from "../FeaturesEditDialog/FeaturesEditDialog";
import ConfirmDeclineDialog from "../../ConfirmDeclineDialog/ConfirmDeclineDialog";

import { COLOR_PURPLE, USER_ROLE } from "../../../utils/helpers/constants";
import { useWindowWidth } from "../../../hooks/useWindowWidth";
import { Feature } from "../../../types/types";
import { useStore } from "@/app/store/useStore";

interface FeatureListItemProps {
  feature: Feature;
}

const FeaturesListItem = ({ feature }: FeatureListItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const windowWidth = useWindowWidth();
  const setFeatures = useStore((state) => state.setFeatures);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //   const allConfigurations = useSelector(selectConfigurations);

  //   //disable features
  //   const isFeatureEnabled = allConfigurations.some((configuration) => {
  //     return configuration.enabledFeatureIds.includes(feature.id);
  //   });

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
      deleteEntry(FIREBASE_COLLECTION_NAMES.FEATURES, feature.id);
      enqueueSnackbar(`Feature "${feature.featureName}" was successfully deleted.`, {
        variant: "success",
      });

      const newFeatures = await getCollection<Feature>(FIREBASE_COLLECTION_NAMES.FEATURES);
      setFeatures(newFeatures);

      closeDeleteDialog();
    } catch (error) {
      enqueueSnackbar(`Failed to delete the feature "${feature.featureName}". Please try again.`, {
        variant: "error",
      });
      console.log("feature deletion failed: ", error);
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
              {feature.featureName[0]}
            </Avatar>
          </ListItemAvatar>
        )}
        {windowWidth > 520 ? (
          <ListItemText primary={feature.featureName} secondary={feature.uuid} />
        ) : (
          <ListItemText
            sx={{ display: "flex", flexDirection: "column" }}
            primary={feature.featureName}
            secondary={feature.uuid}
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
            //   disabled={isFeatureEnabled}
            onClick={openDeleteDialog}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <FeaturesEditDialog open={isEditDialogOpen} handleClose={closeEditDialog} feature={feature} />
      <ConfirmDeclineDialog
        open={isDeleteDialogOpen}
        dialogTitle="Delete Feature"
        dialogText="Are you sure that you want to delete this feature? The operation cannot be undone."
        confirmText="Confirm"
        declineText="Cancel"
        handleConfirmAction={handleDelete}
        handleDeclineAction={closeDeleteDialog}
      />
    </Paper>
  );
};

export default FeaturesListItem;
