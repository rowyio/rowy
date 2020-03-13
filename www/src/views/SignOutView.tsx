import React, { useEffect } from "react";
import { auth } from "../firebase";

import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

import EmptyState from "components/EmptyState";
import CheckIcon from "@material-ui/icons/Check";

export default function SignOutView() {
  useEffect(() => {
    auth.signOut();
  }, []);

  return (
    <EmptyState
      fullScreen
      message="Signed Out"
      description={
        <Button
          component={Link}
          to="/auth"
          variant="outlined"
          color="primary"
          style={{ marginTop: 24 }}
        >
          Sign In Again
        </Button>
      }
      Icon={CheckIcon}
    />
  );
}
