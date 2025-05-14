import { Fragment, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import AddIcon from "@mui/icons-material/Add";

import AppListSearchBar from "../UsersContent/UserListSearchBar/UserListSearchBar";
import AppList from "./AppList/AppList";
import AppAddDialog from "./AppAddDialog/AppAddDialog";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

const AppsContent = () => {
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
            Apps
          </Typography>
          <AppListSearchBar />
          <AppList />
        </Stack>
      </Container>
      <AppAddDialog open={isAddDialogOpen} handleClose={closeAddDialog} />
      <FloatingActionButton handleClick={openAddDialog}>
        <AddIcon />
      </FloatingActionButton>
    </Fragment>
  );
};

export default AppsContent;
