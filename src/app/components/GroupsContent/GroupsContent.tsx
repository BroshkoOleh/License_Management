"use client";

import { Fragment, useState } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import AddIcon from "@mui/icons-material/Add";

import GroupListItem from "./GroupListItem/GroupListItem";
import GroupAddDialog from "./GroupAddDialog/GroupAddDialog";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import React from "react";
import { alphanumericSort } from "../../utils/helpers/helpers";
import useDebounce from "../../hooks/useDebounce";
import UserListSearchBar from "../UsersContent/UserListSearchBar/UserListSearchBar";
import { warningNoGroup, warningNoGroupResults } from "../../utils/helpers/warnings";
import { useGroups } from "@/app/store/storeHooks/useGroups";
import { useStore } from "@/app/store/useStore";

export default function GroupsContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const groups = useGroups();

  const queryItems = useStore((state) => state.searchString);
  const debounceQuery = useDebounce(queryItems, 500);

  const visibleGroups = groups
    .filter((group) => {
      const query = debounceQuery.toLowerCase();
      const groupNameMatch = group.groupName.toLowerCase().includes(query);
      const userEmailsMatch = group.userEmails.some((email) => email.toLowerCase().includes(query));

      return groupNameMatch || userEmailsMatch;
    })
    .sort((a, b) => alphanumericSort(a, b, "groupName"));

  const determineWarning = () => {
    if (groups.length === 0) {
      return warningNoGroup;
    } else if (visibleGroups.length === 0) {
      return warningNoGroupResults;
    }

    return null;
  };

  const warningMessage = determineWarning();

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
            Groups
          </Typography>
          {/* <GroupListSearchBar /> */}
          <UserListSearchBar />
          <List>
            {!warningMessage ? (
              visibleGroups.map((group, idx) => <GroupListItem key={idx} group={group} />)
            ) : (
              <Typography textAlign="center">{warningMessage}</Typography>
            )}
          </List>
        </Stack>
      </Container>
      <FloatingActionButton handleClick={openAddDialog}>
        <AddIcon />
      </FloatingActionButton>
      <GroupAddDialog open={isAddDialogOpen} handleClose={closeAddDialog} />
    </Fragment>
  );
}
