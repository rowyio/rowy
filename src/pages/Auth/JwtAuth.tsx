import { useState } from "react";
import { useSnackbar } from "notistack";

import { TextField, Button } from "@mui/material";

import { auth } from "../../firebase";
import AuthLayout from "@src/components/Auth/AuthLayout";

export default function JwtAuthPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [jwt, setJWT] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    try {
      await auth.signInWithCustomToken(jwt);
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
