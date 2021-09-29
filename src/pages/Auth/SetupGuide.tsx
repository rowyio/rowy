import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import AuthLayout from "components/Auth/AuthLayout";

import { WIKI_LINKS } from "constants/externalLinks";
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
        endIcon={<OpenInNewIcon />}
        href={WIKI_LINKS.setUpAuth}
        target="_blank"
        rel="noopener noreferrer"
      >
        Setup guide
      </Button>
    </AuthLayout>
  );
}
