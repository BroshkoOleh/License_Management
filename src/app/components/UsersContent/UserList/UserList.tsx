"use client";
import List from "@mui/material/List";
import UserListItem from "../UserListItem/UserListItem";
import { alphanumericSort } from "../../../utils/helpers/helpers";
import useDebounce from "../../../hooks/useDebounce";
import { warningNoUsersResults } from "../../../utils/helpers/warnings";
import { Typography } from "@mui/material";
import { useStore } from "../../../store/useStore";
import { useUsers } from "@/app/store/storeHooks/useUsers";

const UserList = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const users = useUsers();

  const queryItems = useStore((state) => state.searchString);
  const debounceQuery = useDebounce(queryItems, 500);

  const visibleUsers = users
    .filter((user) => {
      // Check if displayName and email exist before using them
      let displayNameMatch = false;
      let emailMatch = false;

      if (user.displayName) {
        displayNameMatch = user.displayName.toLowerCase().includes(debounceQuery.toLowerCase());
      }

      if (user.email) {
        emailMatch = user.email.toLowerCase().includes(debounceQuery.toLowerCase());
      }

      return displayNameMatch || emailMatch;
    })
    .sort((a, b) => alphanumericSort(a, b, "displayName"));

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <List>
      {visibleUsers.length > 0 ? (
        visibleUsers.map((user, index) => <UserListItem key={index} user={user} />)
      ) : (
        <Typography textAlign="center">{warningNoUsersResults}</Typography>
      )}
    </List>
  );
};

export default UserList;
