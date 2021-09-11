import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import AuthLayout from "components/Auth/AuthLayout";
import EmptyState from "components/EmptyState";
import FirebaseIcon from "assets/icons/Firebase";

import WIKI_LINKS from "constants/wikiLinks";
import { name } from "@root/package.json";

export default function AuthSetupGuide() {
  return (
    <AuthLayout>
      <EmptyState
        Icon={FirebaseIcon}
        message="Set Up Firebase Authentication"
        description={
          <>
            <span>
              To sign in to {name}, set up Firebase Authentication in the
              Firebase Console.
            </span>
            <Button
              variant="contained"
              color="primary"
              endIcon={<OpenInNewIcon />}
              href={WIKI_LINKS.setUpAuth}
              target="_blank"
              rel="noopener noreferrer"
            >
              Setup Guide
            </Button>
          </>
        }
      />
    </AuthLayout>
  );
}
