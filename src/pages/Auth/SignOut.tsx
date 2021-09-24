import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";

import AuthLayout from "components/Auth/AuthLayout";
import { auth } from "../../firebase";

export default function SignOutPage() {
  useEffect(() => {
    auth.signOut();
  }, []);

  return (
    <AuthLayout title="Signed Out">
      <Button component={Link} to="/auth" variant="outlined">
        Sign In Again
      </Button>
    </AuthLayout>
  );
}
