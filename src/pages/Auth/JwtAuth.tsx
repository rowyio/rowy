import { useState } from "react";
import { useSnackbar } from "notistack";

import { TextField, Typography, Button } from "@material-ui/core";

import { auth } from "../../firebase";
import AuthLayout from "components/Auth/AuthLayout";

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
    <AuthLayout loading={loading}>
      <Typography variant="h6" component="h2">
        Test Authentication
      </Typography>

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
