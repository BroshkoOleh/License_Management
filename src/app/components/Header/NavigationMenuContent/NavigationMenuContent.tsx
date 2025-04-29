"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Fragment } from "react";

import { USER_ROLE } from "../../../utils/helpers/constants";
import { memo } from "react";
import { useStore } from "../../../store/useStore";

import Link from "next/link";

interface NavigationMenuContentrProps {
  handleDrawerToggle: () => void;
}

// MobileSideBarMenu

function NavigationMenuContent({ handleDrawerToggle }: NavigationMenuContentrProps) {
  const currentUser = useStore((state) => state.enhancedUser);

  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        LICENSE MANAGEMENT
      </Typography>
      <Divider />
      {currentUser ? (
        <List>
          <ListItem disablePadding>
            <Link href="/licenses">
              <ListItemButton>
                <ListItemText primary="Licenses" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/configurations">
              <ListItemButton>
                <ListItemText primary="Configurations" />
              </ListItemButton>
            </Link>
          </ListItem>
          {currentUser.role === USER_ROLE.ADMIN ? (
            <Fragment>
              <ListItem disablePadding>
                <Link href="/apps">
                  <ListItemButton>
                    <ListItemText primary="Apps" />
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/features">
                  <ListItemButton>
                    <ListItemText primary="Features" />
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/languages">
                  <ListItemButton>
                    <ListItemText primary="Languages" />
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/groups">
                  <ListItemButton>
                    <ListItemText primary="Groups" />
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/users">
                  <ListItemButton>
                    <ListItemText primary="Users" />
                  </ListItemButton>
                </Link>
              </ListItem>
            </Fragment>
          ) : null}
          {/* <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem> */}
        </List>
      ) : null}
    </Box>
  );
}

export default memo(NavigationMenuContent);
