import type { ISetupStep, ISetupStepBodyProps } from "../types";

import {
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  Button,
} from "@mui/material";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import { useAppContext } from "@src/contexts/AppContext";

export default {
  id: "welcome",
  layout: "centered",
  shortTitle: "Welcome",
  title: "Welcome",
  body: StepWelcome,
} as ISetupStep;

function StepWelcome({ isComplete, setComplete }: ISetupStepBodyProps) {
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
        <Typography variant="body1" paragraph>
          Project: <code>{projectId}</code>
        </Typography>
      </div>

      <FormControlLabel
        control={
          <Checkbox
            checked={isComplete}
            onChange={(e) => setComplete(e.target.checked)}
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
        disabled={!isComplete}
        type="submit"
      >
        Get started
      </Button>
    </>
  );
}
