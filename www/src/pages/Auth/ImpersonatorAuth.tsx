import React, { useEffect, useState } from "react";

import { Typography, Button, TextField } from "@material-ui/core";

import AuthCard from "components/Auth/AuthCard";
import { handleGoogleAuth, signOut } from "utils/auth";
import GoogleLogo from "assets/google-icon.svg";
import { useSnackContext } from "contexts/snackContext";

import { ImpersonatorAuth } from "../../firebase/callables";
import { auth } from "../../firebase";

export default function ImpersonatorAuthPage() {
  useEffect(() => {
    //sign out user on initial load
    signOut();
  }, []);
  const [loading, setLoading] = useState(false);
  const snack = useSnackContext();
  const [adminUser, setAdminUser] = useState();
  const [email, setEmail] = useState("");

  const handleAuth = async (email: string) => {
    setLoading(true);
    const resp = await ImpersonatorAuth(email);
    setLoading(false);
    if (resp.data.success) {
      snack.open({ message: resp.data.message });

      await auth.signInWithCustomToken(resp.data.jwt);
      window.location.href = "/";
    }
  };

  return (
    <AuthCard height={400} loading={loading}>
      <Typography variant="overline">Admin Authentication</Typography>
      {adminUser === undefined ? (
        <>
          <Typography variant="body1">
            Please select an admin account to authenticate
          </Typography>
          <Button
            onClick={() => {
              handleGoogleAuth(
                (authUser, roles) => {
                  if (roles.includes("ADMIN")) {
                    setAdminUser(authUser.user);
                  } else {
                    snack.open({ message: "this account is not an admin" });
                    signOut();
                  }
                },
                (error: Error) => {
                  snack.open({ message: error.message });
                }
              );
            }}
            color="primary"
            size="large"
            variant="outlined"
            startIcon={
              <img
                src={GoogleLogo}
                width={16}
                style={{ marginRight: 8, display: "block" }}
              />
            }
          >
            SIGN IN WITH GOOGLE
          </Button>
        </>
      ) : (
        <>
          <TextField name="email" onChange={(e) => setEmail(e.target.value)} />
          <Button disabled={email === ""} onClick={() => handleAuth(email)}>
            Sign in
          </Button>
        </>
      )}
    </AuthCard>
  );
}
