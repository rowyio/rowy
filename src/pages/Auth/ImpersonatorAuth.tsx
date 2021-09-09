import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import { Typography, Button, TextField } from "@material-ui/core";

import AuthLayout from "components/Auth/AuthLayout";
import FirebaseUi from "components/Auth/FirebaseUi";

import { signOut } from "utils/auth";
import { auth } from "../../firebase";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { RunRoutes } from "@src/constants/runRoutes";

export default function ImpersonatorAuthPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { rowyRun } = useProjectContext();

  useEffect(() => {
    //sign out user on initial load
    // signOut();
  }, []);

  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState();
  const [email, setEmail] = useState("");

  const handleAuth = async (email: string) => {
    console.log("!rowyRun");

    if (!rowyRun) return;
    console.log("rowyRun");
    setLoading(true);
    const resp = await rowyRun({
      route: RunRoutes.impersonateUser,
      params: [email],
    });
    console.log(resp);
    setLoading(false);
    if (resp.success) {
      enqueueSnackbar(resp.message, { variant: "success" });
      await auth.signInWithCustomToken(resp.token);
      window.location.href = "/";
    } else {
      enqueueSnackbar(resp.error.message, { variant: "error" });
    }
  };

  return (
    <AuthLayout loading={loading}>
      <Typography variant="h6" component="h2">
        Admin Authentication
      </Typography>

      {adminUser === undefined ? (
        <FirebaseUi
          uiConfig={{
            callbacks: {
              signInSuccessWithAuthResult: (authUser) => {
                authUser.user.getIdTokenResult().then((result) => {
                  if (result.claims.roles?.includes("ADMIN")) {
                    setAdminUser(authUser.user);
                  } else {
                    enqueueSnackbar("Not an admin account", {
                      variant: "error",
                    });
                    signOut();
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
            Sign In
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
