import { ISetupStep, ISetupStepBodyProps } from "../types";

import {
  useMediaQuery,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "../SetupItem";

export default {
  id: "project",
  shortTitle: "Project",
  title: "Select project",
  description: "Select which Firebase project to set up Rowy on.",
  body: StepProject,
} as ISetupStep;

function StepProject({ isComplete, setComplete }: ISetupStepBodyProps) {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <SetupItem
      title="Select an existing project or create a new one."
      status="incomplete"
    >
      <Stack
        spacing={2}
        direction={isMobile ? "column" : "row"}
        justifyContent="flex-start"
        alignItems="center"
      >
        <TextField
          label="Project"
          select
          fullWidth
          style={isMobile ? undefined : { minWidth: 300 }}
          helperText={isMobile ? undefined : " "}
          SelectProps={{
            displayEmpty: true,
            renderValue: (v: any) =>
              v || (
                <Typography color="text.disabled">Select a project…</Typography>
              ),
          }}
          onChange={() => setComplete()}
        >
          <MenuItem value="rowyio">rowyio</MenuItem>
          <MenuItem value="rowy-service">rowy-service</MenuItem>
          <MenuItem value="tryrowy">tryrowy</MenuItem>
          <MenuItem value="rowy-cms-test">rowy-cms-test</MenuItem>
          <MenuItem value="rowy-run">rowy-run</MenuItem>
        </TextField>

        <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem>
          OR
        </Divider>

        <Button
          onClick={() => setComplete()}
          style={isMobile ? undefined : { minWidth: 300 }}
        >
          Create project in Firebase Console
          <InlineOpenInNewIcon />
        </Button>
      </Stack>
    </SetupItem>
  );
}
