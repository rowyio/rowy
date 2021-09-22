import { ISetupStepBodyProps } from "pages/Setup";

import { FormControlLabel, Checkbox, Typography, Link } from "@mui/material";
import OpenInNewIcon from "components/InlineOpenInNewIcon";

import { useAppContext } from "contexts/AppContext";
import { EXTERNAL_LINKS } from "constants/externalLinks";

export default function Step0Welcome({
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { projectId } = useAppContext();

  return (
    <>
      <div>
        <Typography variant="body1" gutterBottom>
          Get up and running in around 5 minutes.
        </Typography>
        <Typography variant="body1" paragraph>
          You’ll easily set up back-end functionality, Firestore Rules, and user
          management.
        </Typography>
        <Typography variant="body1">
          You’ll set up the project: <b>{projectId}</b>
        </Typography>
      </div>

      <FormControlLabel
        control={
          <Checkbox
            checked={completion.welcome}
            onChange={(e) =>
              setCompletion((c) => ({ ...c, welcome: e.target.checked }))
            }
          />
        }
        label={
          <>
            <Typography sx={{ mt: 1.25, mb: 0.5 }}>
              I agree to the terms and conditions
            </Typography>
            <Link
              href={EXTERNAL_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              display="block"
              variant="body2"
              color="text.secondary"
            >
              Read the simple English version
              <OpenInNewIcon />
            </Link>
            <Link
              href={EXTERNAL_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              display="block"
              variant="body2"
              color="text.secondary"
            >
              Read the full terms and conditions
              <OpenInNewIcon />
            </Link>
          </>
        }
        sx={{ pr: 1, textAlign: "left", alignItems: "flex-start", p: 0, m: 0 }}
      />
    </>
  );
}
