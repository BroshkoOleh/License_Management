import { Box } from "@mui/material";
import Link from "next/link";
import Button from "@mui/material/Button";
import { Fragment } from "react";
import { USER_ROLE } from "../../../utils/helpers/constants";
import { memo } from "react";
import { CurrentUserType } from "../../../types/types";

interface HeaderNavDesktopProps {
  currentUser: CurrentUserType;
  isMobile: boolean;
}

function HeaderNavDesktop({ currentUser, isMobile }: HeaderNavDesktopProps) {
  return (
    <Box
      sx={{
        display: !isMobile ? "flex" : "none",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Link href="/licenses">
        <Button sx={{ color: "#fff", pb: "5px" }}>Licenses</Button>
      </Link>
      <Link href="/configurations">
        <Button sx={{ color: "#fff", pb: "5px" }}>Configurations</Button>
      </Link>
      {currentUser.role === USER_ROLE.ADMIN ? (
        <Fragment>
          <Link href="/apps">
            <Button sx={{ color: "#fff", pb: "5px" }}>Apps</Button>
          </Link>
          <Link href="/features">
            <Button sx={{ color: "#fff", pb: "5px" }}>Features</Button>
          </Link>
          <Link href="/languages">
            <Button sx={{ color: "#fff", pb: "5px" }}>Languages</Button>
          </Link>
          <Link href="/groups">
            <Button sx={{ color: "#fff", pb: "5px" }}>Groups</Button>
          </Link>
          <Link href="/users">
            <Button sx={{ color: "#fff", pb: "5px" }}>Users</Button>
          </Link>
        </Fragment>
      ) : null}
      {/* <Button sx={{ color: "#fff", pb: "5px" }}>Sign Out</Button> */}
    </Box>
  );
}

export default memo(HeaderNavDesktop);
