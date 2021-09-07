import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import { Typography, Button, TextField } from "@material-ui/core";

import AuthLayout from "components/Auth/AuthLayout";
import FirebaseUi from "components/Auth/FirebaseUi";

import { signOut } from "utils/auth";
import { ImpersonatorAuth } from "../../firebase/callables";
import { auth } from "../../firebase";

export default function ImpersonatorAuthPage() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    //sign out user on initial load
    signOut();
  }, []);

  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState();
  const [email, setEmail] = useState("");

  const handleAuth = async (email: string) => {
    setLoading(true);
    const resp = await ImpersonatorAuth(email);
    setLoading(false);
    if (resp.data.success) {
      enqueueSnackbar(resp.data.message, { variant: "success" });
      await auth.signInWithCustomToken(resp.data.jwt);
      window.location.href = "/";
    } else {
      enqueueSnackbar(resp.data.message, { variant: "error" });
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
