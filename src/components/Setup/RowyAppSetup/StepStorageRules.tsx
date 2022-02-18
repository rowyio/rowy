import { useSnackbar } from "notistack";
import type { ISetupStep, ISetupStepBodyProps } from "../types";

import { Typography, Button, Grid } from "@mui/material";
import CopyIcon from "@src/assets/icons/Copy";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import DoneIcon from "@mui/icons-material/Done";

import SetupItem from "../SetupItem";
import DiffEditor from "@src/components/CodeEditor/DiffEditor";

import { useAppContext } from "@src/contexts/AppContext";
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
  const { projectId } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <SetupItem
        status="incomplete"
        title="Add the following rules to allow users to access Firebase Storage:"
      >
        <DiffEditor
          original=""
          modified={rules}
          containerProps={{ sx: { width: "100%" } }}
          minHeight={400}
          options={{ renderValidationDecorations: "off" }}
        />

        <Typography variant="inherit">
          Please verify the new rules are valid first.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setComplete()}
          sx={{ mt: -0.5 }}
        >
          Set Firebase Storage rules
        </Button>
      </SetupItem>
    </>
  );
}
