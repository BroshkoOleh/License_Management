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

import LanguageEditDialog from "../LanguageEditDialog/LanguageEditDialog";
import ConfirmDeclineDialog from "../../ConfirmDeclineDialog/ConfirmDeclineDialog";
import { Box } from "@mui/material";

import { COLOR_PURPLE, USER_ROLE } from "../../../utils/helpers/constants";
import { useWindowWidth } from "../../../hooks/useWindowWidth";
import { Language } from "../../../types/types";
import { useStore } from "@/app/store/useStore";

interface LanguageListItemProps {
  language: Language;
}

const LanguageListItem = ({ language }: LanguageListItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const windowWidth = useWindowWidth();
  const setLanguages = useStore((state) => state.setLanguages);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  //   const allConfigurations = useSelector(selectConfigurations);
  //   const isAssigned =
  //     allConfigurations.filter((configuration) => {
  //       return configuration.languageIds.includes(language.id);
  //     }).length > 0;

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
      deleteEntry(FIREBASE_COLLECTION_NAMES.LANGUAGES, language.id);
      enqueueSnackbar(`Language "${language.languageName}" was successfully deleted.`, {
        variant: "success",
      });
      const newLanguages = await getCollection<Language>(FIREBASE_COLLECTION_NAMES.LANGUAGES);
      setLanguages(newLanguages);

      closeDeleteDialog();
    } catch (error) {
      enqueueSnackbar(
        `Failed to delete the language "${language.languageName}". Please try again.`,
        { variant: "error" }
      );
      console.log("language deletion failed: ", error);
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
    >
      <ListItem>
        {windowWidth > 520 && (
          <ListItemAvatar>
            <Avatar
              style={{
                backgroundColor: `${COLOR_PURPLE}`,
              }}
            >
              {language.languageName[0]}
            </Avatar>
          </ListItemAvatar>
        )}
        {windowWidth > 520 ? (
          <ListItemText primary={language.languageName} secondary={language.languageCode} />
        ) : (
          <ListItemText
            sx={{ display: "flex", flexDirection: "column" }}
            primary={language.languageName}
            secondary={language.languageCode}
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
            //   disabled={isAssigned}
            onClick={openDeleteDialog}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <LanguageEditDialog
        open={isEditDialogOpen}
        handleClose={closeEditDialog}
        language={language}
      />
      <ConfirmDeclineDialog
        open={isDeleteDialogOpen}
        dialogTitle="Delete Language Entry"
        dialogText="Are you sure that you want to delete this language? The operation cannot be undone."
        confirmText="Confirm"
        declineText="Cancel"
        handleConfirmAction={handleDelete}
        handleDeclineAction={closeDeleteDialog}
      />
    </Paper>
  );
};

export default LanguageListItem;
