"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore";
import { USER_AUTH_STATES } from "../../../utils/helpers/constants";
import { useRouter } from "next/navigation";

// import { selectAuthStatus } from "../../store/user/user.selector";
// import { USER_AUTH_STATES } from "../../store/user/user.types";

import Grid from "@mui/material/Grid";
import { ResetPasswordForm } from "../RessetPassword/ResetPassword";
import { SignInForm } from "../SignIn/SignIn";

const Auth = () => {
  const router = useRouter();
  const authStatus = useStore((state) => state.authStatus);
  const [refresherOpen, setRefresherOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("authStatus in Auth useEffect", authStatus);
    if (authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED) {
      console.log(`${authStatus} === ${USER_AUTH_STATES.SIGNED_IN_FINISHED}   in Auth useEffect  `);
      router.push("/licenses");
    }
  }, [authStatus, router]);

  if (authStatus !== USER_AUTH_STATES.SIGNED_OUT) {
    return null;
  }

  return (
    <Grid
      container
      paddingY={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ flexGrow: 1 }}
    >
      {refresherOpen ? (
        <ResetPasswordForm setRefresherOpen={setRefresherOpen} email={email} />
      ) : (
        <SignInForm setRefresherOpen={setRefresherOpen} setEmail={setEmail} />
      )}
    </Grid>
  );
};

export default Auth;
