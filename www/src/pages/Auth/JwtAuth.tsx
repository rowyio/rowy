import React, { useState } from "react";

import { TextField, Typography, Button } from "@material-ui/core";

import { auth } from "../../firebase";
import AuthCard from "components/Auth/AuthCard";

export default function JwtAuthPage() {
  const [jwt, setJWT] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    await auth.signInWithCustomToken(jwt);
    window.location.assign("/");
  };

  return (
    <AuthCard height={400} loading={loading}>
      <Typography variant="overline">TEST Authentication</Typography>
      <>
        <TextField name="JWT" onChange={(e) => setJWT(e.target.value)} />
        <Button disabled={jwt === ""} onClick={handleAuth}>
          Sign in
        </Button>
      </>
    </AuthCard>
  );
}
