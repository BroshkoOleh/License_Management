"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";
import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";
import { Fragment, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import UserList from "./UserList/UserList";
import UserAddDialog from "./UserAddDialog/UserAddDialog";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import UserListSearchBar from "./UserListSearchBar/UserListSearchBar";

const UsersContent = () => {
  const [newUserDialog, setNewUserDialog] = useState(false);

  return (
    <Fragment>
      <Container>
        <Stack spacing={4} marginTop={4} marginBottom={8}>
          <Typography variant="h5" textAlign="center">
            Users
          </Typography>
          <UserListSearchBar />
          <UserList />
        </Stack>
      </Container>
      <FloatingActionButton handleClick={() => setNewUserDialog(true)}>
        <AddIcon />
      </FloatingActionButton>
      <UserAddDialog open={newUserDialog} handleClose={() => setNewUserDialog(false)} />
    </Fragment>
  );
};

export default UsersContent;
