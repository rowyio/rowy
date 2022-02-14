import { ISetupStepBodyProps } from "@src/pages/Setup";

import {
  Typography,
  TextField,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "./SetupItem";

import { WIKI_LINKS } from "@src/constants/externalLinks";

export default function Step1Oauth({
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  return (
    <>
      <Typography variant="inherit">
        Select which Firebase project to set up Rowy on.
      </Typography>

      <SetupItem
        title="Select an existing project or create a new one."
        status="incomplete"
      >
        <TextField label="Project" select style={{ minWidth: 200 }}>
          <MenuItem value="lorem">lorem</MenuItem>
          <MenuItem value="ipsum">ipsum</MenuItem>
          <MenuItem value="dolor">dolor</MenuItem>
          <MenuItem value="sit">sit</MenuItem>
          <MenuItem value="amet">amet</MenuItem>
        </TextField>

        <Divider style={{ width: 200 }}>OR</Divider>

        <Button onClick={() => setCompletion((c) => ({ ...c, project: true }))}>
          Create project in Firebase Console
          <InlineOpenInNewIcon />
        </Button>
      </SetupItem>
    </>
  );
}
