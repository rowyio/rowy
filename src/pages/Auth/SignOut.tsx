import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";

import AuthLayout from "@src/components/Auth/AuthLayout";
import { auth } from "../../firebase";

export default function SignOutPage() {
  useEffect(() => {
    auth.signOut();
  }, []);

  return (
    <AuthLayout title="Signed out">
      <Button component={Link} to="/auth" variant="outlined">
        Sign in again
      </Button>
    </AuthLayout>
  );
}
