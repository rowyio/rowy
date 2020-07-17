import React, { useState } from "react";
import queryString from "query-string";

import { Typography, Button } from "@material-ui/core";

import AuthCard from "./AuthCard";

import { handleGoogleAuth } from "./utils";
import GoogleLogo from "assets/google-icon.svg";
import { useSnackContext } from "contexts/snackContext";
export default function GoogleAuthView() {
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
              snack.open({ message: error.message });
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
