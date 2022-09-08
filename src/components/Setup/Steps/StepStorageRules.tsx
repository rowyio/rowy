import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import type {
  ISetupStep,
  ISetupStepBodyProps,
} from "@src/components/Setup/SetupStep";

import { Typography, Button, Grid } from "@mui/material";
import { Copy as CopyIcon } from "@src/assets/icons";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import DoneIcon from "@mui/icons-material/Done";

import SetupItem from "@src/components/Setup/SetupItem";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";
import {
  RULES_START,
  RULES_END,
  REQUIRED_RULES,
} from "@src/config/storageRules";

export default {
  id: "storageRules",
  shortTitle: "Storage rules",
  title: "Set up Firebase Storage rules",
  description:
    "Image and File fields store files in Firebase Storage. Your users will need read and write access.",
  body: StepStorageRules,
} as ISetupStep;

const rules = RULES_START + REQUIRED_RULES + RULES_END;

function StepStorageRules({ isComplete, setComplete }: ISetupStepBodyProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <SetupItem
        status="incomplete"
        title="Add the following rules to allow users to access Firebase Storage:"
      >
        <Typography
          component="pre"
          sx={{
            width: "100%",
            height: 250,
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
