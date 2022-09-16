import { useState } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { signInWithCustomToken } from "firebase/auth";

import { TextField, Button } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";

export default function JwtAuthPage() {
  const [firebaseAuth] = useAtom(firebaseAuthAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  const [jwt, setJWT] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    try {
      await signInWithCustomToken(firebaseAuth, jwt);
      enqueueSnackbar("Success", { variant: "success" });
      window.location.assign("/");
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout loading={loading} title="Test auth">
      <TextField
        name="JWT"
        label="JWT"
        autoFocus
        fullWidth
        onChange={(e) => setJWT(e.target.value)}
      />
      <Button variant="contained" disabled={jwt === ""} onClick={handleAuth}>
        Sign in
      </Button>
    </AuthLayout>
  );
}
