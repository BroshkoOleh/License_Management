"use client";
import { useEffect, useState } from "react";
import { USER_AUTH_STATES } from "../../../utils/helpers/constants";
import { useRouter } from "next/navigation";

// import { selectAuthStatus } from "../../store/user/user.selector";
// import { USER_AUTH_STATES } from "../../store/user/user.types";

import Grid from "@mui/material/Grid";
import { ResetPasswordForm } from "../RessetPassword/ResetPassword";
import { SignInForm } from "../SignIn/SignIn";
import { useAuthStatus } from "@/app/store/storeHooks/useAuthStatus";

const Auth = () => {
  const router = useRouter();
  const authStatus = useAuthStatus();
  const [refresherOpen, setRefresherOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (authStatus === USER_AUTH_STATES.SIGNED_IN_FINISHED) {
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
