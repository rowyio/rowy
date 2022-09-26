import { useEffect } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";

import { Button } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";

export default function SignOutPage() {
  const [firebaseAuth] = useAtom(firebaseAuthAtom, projectScope);

  useEffect(() => {
    signOut(firebaseAuth);
  }, [firebaseAuth]);

  return (
    <AuthLayout title="Signed out">
      <Button component={Link} to="/auth" variant="outlined">
        Sign in again
      </Button>
    </AuthLayout>
  );
}
