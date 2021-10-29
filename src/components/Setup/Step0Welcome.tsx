import { ISetupStepBodyProps } from "@src/pages/Setup";

import { FormControlLabel, Checkbox, Typography, Link } from "@mui/material";

import { useAppContext } from "@src/contexts/AppContext";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default function Step0Welcome({
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { projectId } = useAppContext();

  return (
    <>
      <div>
        <Typography variant="body1" gutterBottom>
          You’ll be up and running in just a few minutes.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Configure your project’s backend functionality, Firestore Rules, and
          user management.
        </Typography>
        <Typography variant="body1">
          Project: <b>{projectId}</b>
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
            I agree to the{" "}
            <Link
              href={EXTERNAL_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.primary"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href={EXTERNAL_LINKS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.primary"
            >
              Privacy Policy
            </Link>
          </>
        }
        sx={{
          pr: 1,
          textAlign: "left",
          alignItems: "flex-start",
          p: 0,
          m: 0,
        }}
      />
    </>
  );
}
