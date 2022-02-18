import type { ISetupStep, ISetupStepBodyProps } from "../types";

import {
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  Button,
} from "@mui/material";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default {
  id: "welcome",
  layout: "centered",
  shortTitle: "Welcome",
  title: "Welcome",
  description: (
    <>
      Get started with Rowy in just a few minutes.
      <br />
      <br />
      We have no access to your data and it always stays on your Firebase
      project.
    </>
  ),
  body: StepWelcome,
} as ISetupStep;

function StepWelcome({ isComplete, setComplete }: ISetupStepBodyProps) {
  return (
    <>
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

      <div>
        <Typography variant="body2" paragraph sx={{ mt: 4 }}>
          Want to invite your teammate to help with setup instead?
        </Typography>
        <Button>Send to teammate</Button>
      </div>
    </>
  );
}
