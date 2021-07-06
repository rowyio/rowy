import { useState } from "react";

import { TextField, Typography, Button } from "@material-ui/core";

import { auth } from "../../firebase";
import { useSnackContext } from "contexts/SnackContext";
import AuthLayout from "components/Auth/AuthLayout";

export default function JwtAuthPage() {
  const snack = useSnackContext();

  const [jwt, setJWT] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    try {
      await auth.signInWithCustomToken(jwt);
      snack.open({ message: "Success", variant: "success" });
      window.location.assign("/");
    } catch (e) {
      snack.open({ message: e.message, variant: "error" });
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
