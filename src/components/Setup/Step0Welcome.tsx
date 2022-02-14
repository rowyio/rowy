import { ISetupStepBodyProps } from "@src/pages/Setup";

import {
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  Button,
} from "@mui/material";

import { useAppContext } from "@src/contexts/AppContext";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export interface IStep0WelcomeProps extends ISetupStepBodyProps {
  handleContinue: () => void;
}

export default function Step0Welcome({
  completion,
  setCompletion,
  handleContinue,
}: IStep0WelcomeProps) {
  const { projectId } = useAppContext();

  return (
    <>
      <div>
        <Typography variant="body1" paragraph>
          Get started with Rowy in just a few minutes.
        </Typography>
        <Typography variant="body1" paragraph>
          We have no access to your data and it always stays on your Firebase
          project.
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

      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!completion.welcome}
        onClick={handleContinue}
      >
        Get started
      </Button>

      <div>
        <Typography variant="body2" paragraph sx={{ mt: 4 }}>
          Want to invite your teammate to help with setup instead?
        </Typography>
        <Button>Send to teammate</Button>
      </div>
    </>
  );
}
