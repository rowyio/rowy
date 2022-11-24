import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import {
  getIdTokenResult,
  signOut,
  signInWithCustomToken,
} from "firebase/auth";

import { Typography, Button, TextField } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";
import FirebaseUi from "@src/components/FirebaseUi";

import { projectScope, rowyRunAtom } from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { runRoutes } from "@src/constants/runRoutes";

export default function ImpersonatorAuthPage() {
  const [firebaseAuth] = useAtom(firebaseAuthAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // sign out user on initial load
    signOut(firebaseAuth);
  }, [firebaseAuth]);

  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState();
  const [email, setEmail] = useState("");

  const handleAuth = async (email: string) => {
    setLoading(true);
    const resp = await rowyRun({
      route: runRoutes.impersonateUser,
      params: [email],
    });
    setLoading(false);
    if (resp.success) {
      enqueueSnackbar(resp.message, { variant: "success" });
      await signInWithCustomToken(firebaseAuth, resp.token);
      window.location.href = "/";
    } else {
      enqueueSnackbar(resp.error.message, { variant: "error" });
    }
  };

  return (
    <AuthLayout
      loading={loading}
      title="Admin auth"
      description={
        <>
          <Typography
            variant="inherit"
            component="span"
            display="block"
            gutterBottom
          >
            Using an admin account, sign in as another user on this project to
            test permissions and access controls.
          </Typography>
          <Typography variant="inherit" component="span">
            Make sure the Rowy Run service account has the{" "}
            <b>Service Account Token Creator</b> IAM role.
          </Typography>
        </>
      }
    >
      {adminUser === undefined ? (
        <FirebaseUi
          uiConfig={{
            callbacks: {
              signInSuccessWithAuthResult: (authUser) => {
                getIdTokenResult(authUser.user).then((result) => {
                  const roles = result.claims.roles;
                  if (Array.isArray(roles) && roles.includes("ADMIN")) {
                    setAdminUser(authUser.user);
                  } else {
                    enqueueSnackbar("Not an admin account", {
                      variant: "error",
                    });
                    signOut(firebaseAuth);
                  }
                });

                return false;
              },
            },
          }}
        />
      ) : (
        <>
          <TextField
            name="email"
            label="Email"
            fullWidth
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={email === ""}
            onClick={() => handleAuth(email)}
          >
            Sign in
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
