import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import AuthLayout from "components/Auth/AuthLayout";
import EmptyState from "components/EmptyState";
import { auth } from "../../firebase";

export default function SignOutPage() {
  useEffect(() => {
    auth.signOut();
  }, []);

  return (
    <AuthLayout>
      <EmptyState
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
    </AuthLayout>
  );
}
