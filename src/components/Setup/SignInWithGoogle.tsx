import { useState } from "react";

import { Typography } from "@mui/material";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

import { auth, googleProvider } from "@src/firebase";

export interface ISignInWithGoogleProps extends Partial<LoadingButtonProps> {
  matchEmail?: string;
}

export default function SignInWithGoogle({
  matchEmail,
  ...props
}: ISignInWithGoogleProps) {
  const [status, setStatus] = useState<"IDLE" | "LOADING" | string>("IDLE");

  const handleSignIn = async () => {
    setStatus("LOADING");
    try {
      const result = await auth.signInWithPopup(googleProvider);
      if (!result.user) throw new Error("Missing user");
      if (
        matchEmail &&
        matchEmail.toLowerCase() !== result.user.email?.toLowerCase()
      )
        throw Error(`Account is not ${matchEmail}`);

      setStatus("IDLE");
    } catch (error: any) {
      if (auth.currentUser) auth.signOut();
      console.log(error);
      setStatus(error.message);
    }
  };

  return (
    <div>
      <LoadingButton
        startIcon={
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width={18}
            height={18}
            style={{
              margin: (24 - 18) / 2,
              filter: props.disabled ? "grayscale(1)" : "",
            }}
          />
        }
        onClick={handleSignIn}
        loading={status === "LOADING"}
        style={{ minHeight: 40 }}
        sx={{
          minHeight: 40,
          "& .MuiButton-startIcon": { mr: 3 },
          "&.MuiButton-outlined": { pr: 3 },
        }}
        {...props}
      >
        Sign in with Google
      </LoadingButton>

      {status !== "LOADING" && status !== "IDLE" && (
        <Typography
          variant="caption"
          color="error"
          display="block"
          sx={{ m: 0.5 }}
        >
          {status}
        </Typography>
      )}
    </div>
  );
}
