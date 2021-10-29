import { Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import AuthLayout from "@src/components/Auth/AuthLayout";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { name } from "@root/package.json";

export default function AuthSetupGuide() {
  return (
    <AuthLayout
      title="Set up Firebase Authentication"
      description={
        <>
          To sign in to {name}, first set up Firebase Authentication in the
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
