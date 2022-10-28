import { useState } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import type {
  ISetupStep,
  ISetupStepBodyProps,
} from "@src/components/Setup/SetupStep";

import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
} from "@mui/material";
import { Copy as CopyIcon } from "@src/assets/icons";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import DoneIcon from "@mui/icons-material/Done";

import SetupItem from "@src/components/Setup/SetupItem";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";
import { CONFIG } from "@src/config/dbPaths";
import {
  RULES_START,
  RULES_END,
  REQUIRED_RULES,
  ADMIN_RULES,
  RULES_UTILS,
} from "@src/config/firestoreRules";

export default {
  id: "rules",
  shortTitle: "Firestore Rules",
  title: "Set up Firestore rules",
  description: (
    <>
      Rowy configuration is stored in the <code>{CONFIG}</code> collection on
      Firestore. Your users will need read access to this collection and admins
      will need write access.
    </>
  ),
  body: StepRules,
} as ISetupStep;

function StepRules({ isComplete, setComplete }: ISetupStepBodyProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  const [adminRule, setAdminRule] = useState(true);

  const rules =
    RULES_START +
    (adminRule ? ADMIN_RULES : "") +
    REQUIRED_RULES +
    RULES_UTILS +
    RULES_END;

  return (
    <>
      <SetupItem
        status="incomplete"
        title="Add the following rules to enable access to Rowy configuration:"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={adminRule}
              onChange={(e) => setAdminRule(e.target.checked)}
            />
          }
          label="Allow admins to read and write all documents"
          sx={{ "&&": { ml: -11 / 8, mb: -11 / 8 }, width: "100%" }}
        />

        <Typography
          component="pre"
          sx={{
            width: "100%",
            height: 400,
            resize: "both",
            overflow: "auto",

            "& .comment": { color: "info.dark" },
          }}
          dangerouslySetInnerHTML={{
            __html: rules.replace(
              /(\/\/.*$)/gm,
              `<span class="comment">$1</span>`
            ),
          }}
        />

        <div>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                startIcon={<CopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(rules);
                  enqueueSnackbar("Copied to clipboard");
                }}
              >
                Copy to clipboard
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                href={`https://console.firebase.google.com/project/${
                  projectId || "_"
                }/firestore/rules`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Set up in Firebase Console
                <InlineOpenInNewIcon />
              </Button>
            </Grid>
          </Grid>
        </div>
      </SetupItem>

      <SetupItem
        title={
          isComplete ? (
            "Marked as done"
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
              onClick={() => setComplete()}
            >
              Mark as done
            </Button>
          )
        }
        status={isComplete ? "complete" : "incomplete"}
      />
    </>
  );
}
