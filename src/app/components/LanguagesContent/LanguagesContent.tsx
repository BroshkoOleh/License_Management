import { Fragment, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import AddIcon from "@mui/icons-material/Add";

import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";
import LanguageList from "./LanguageList/LanguageList";
import LanguageAddDialog from "./LanguageAddDialog/LanguageAddDialog";
import LanguageListSearchBar from "../UsersContent/UserListSearchBar/UserListSearchBar";

const LanguagesContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <Fragment>
      <Container>
        <Stack spacing={4} marginTop={4} marginBottom={8}>
          <Typography variant="h5" textAlign="center">
            Languages
          </Typography>
          <LanguageListSearchBar />
          <LanguageList />
        </Stack>
      </Container>
      <FloatingActionButton handleClick={openAddDialog}>
        <AddIcon />
      </FloatingActionButton>
      <LanguageAddDialog open={isAddDialogOpen} handleClose={closeAddDialog} />
    </Fragment>
  );
};

export default LanguagesContent;
