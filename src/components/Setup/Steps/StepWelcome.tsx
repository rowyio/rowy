import { useAtom } from "jotai";
import type {
  ISetupStep,
  ISetupStepBodyProps,
} from "@src/components/Setup/SetupStep";

import {
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  Button,
} from "@mui/material";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import { projectScope, projectIdAtom } from "@src/atoms/projectScope";

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
  const [projectId] = useAtom(projectIdAtom, projectScope);

  return (
    <>
      <Typography variant="inherit">
        Project: <code>{projectId}</code>
      </Typography>

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
