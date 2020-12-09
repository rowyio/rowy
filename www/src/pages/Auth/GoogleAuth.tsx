import React, { useState } from "react";
import queryString from "query-string";

import { Typography, Button } from "@material-ui/core";

import AuthCard from "components/Auth/AuthCard";

import { handleGoogleAuth } from "../../utils/auth";
import GoogleLogo from "assets/google-icon.svg";
import { useSnackContext } from "contexts/SnackContext";
import { auth } from "../../firebase";

export default function GoogleAuthPage() {
  const [loading, setLoading] = useState(false);
  const snack = useSnackContext();
  const parsedQuery = queryString.parse(window.location.search);

  return (
    <AuthCard height={230} loading={loading}>
      <Typography variant="overline">Google Account</Typography>

      <Button
        onClick={() => {
          setLoading(true);
          handleGoogleAuth(
            () => {
              setLoading(false);
              window.location.replace("/");
            },
            (error: Error) => {
              setLoading(false);
              console.log(error);
              if (
                error.message ===
                "The identity provider configuration is disabled."
              ) {
                snack.open({
                  severity: "warning",
                  message:
                    "You must enable Google sign-in for your Firebase project",
                  action: (
                    <Button
                      component="a"
                      href={`https://console.firebase.google.com/u/0/project/${auth.app.options["projectId"]}/authentication/providers`}
                      target="_blank"
                    >
                      Go to settings
                    </Button>
                  ),
                });
              } else if (
                error.message === "This account does not have any roles"
              ) {
                snack.open({
                  severity: "warning",
                  message: "You must set roles for this user",
                  action: (
                    <Button
                      component="a"
                      href="https://github.com/AntlerVC/firetable/wiki/Role-Based-Security-Rules#set-user-roles-with-the-firetable-cli"
                      target="_blank"
                    >
                      Instructions
                    </Button>
                  ),
                });
              } else {
                snack.open({ message: error.message });
              }
            },
            parsedQuery.email as string
          );
        }}
        color="primary"
        size="large"
        variant="outlined"
        startIcon={
          <img
            src={GoogleLogo}
            width={16}
            height={16}
            style={{ marginRight: 8, display: "block" }}
          />
        }
      >
        SIGN IN WITH GOOGLE
      </Button>
    </AuthCard>
  );
}
