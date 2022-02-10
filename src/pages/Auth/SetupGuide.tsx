import { Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import AuthLayout from "@src/components/Auth/AuthLayout";

import { WIKI_LINKS } from "@src/constants/externalLinks";

export default function AuthSetupGuide() {
  return (
    <AuthLayout
      title="Set up Firebase Authentication"
      description={
        <>
          To sign in to Rowy, first set up Firebase Authentication in the
          Firebase Console.
        </>
      }
    >
      <Button
        variant="contained"
        color="primary"
        href={WIKI_LINKS.setupFirebaseProject}
        target="_blank"
        rel="noopener noreferrer"
      >
        Setup guide
        <InlineOpenInNewIcon />
      </Button>
    </AuthLayout>
  );
}
