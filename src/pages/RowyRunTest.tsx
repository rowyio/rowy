import { useState } from "react";
import { useSnackbar } from "notistack";

import Navigation from "components/Navigation";
import {
  useTheme,
  Container,
  Button,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import SparkIcon from "@mui/icons-material/OfflineBoltOutlined";
import { useConfirmation } from "components/ConfirmationDialog";

import SnackbarProgress, {
  ISnackbarProgressRef,
} from "components/SnackbarProgress";
import { useProjectContext } from "@src/contexts/ProjectContext";

const typographyVariants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "button",
  "caption",
  "overline",
];

export default function TestView() {
  const theme = useTheme();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { rowyRun } = useProjectContext();
  const [result, setResult] = useState<any>({});

  const [method, setMethod] = useState<"GET" | "POST">("GET");
  const [path, setPath] = useState("");
  const handleMethodChange = (_, newMethod) => setMethod(newMethod);

  const handleRun = async () => {
    console.log("run");
    if (!rowyRun) return;
    setLoading(true);
    const resp = await rowyRun({
      route: {
        method,
        path,
      },
    });
    setResult(resp);
    setLoading(false);
  };
  return (
    <Navigation title="Rowy Run Sandbox">
      {loading && <LinearProgress />}
      <Container style={{ margin: "24px 0 200px" }}>
        <Tabs value={method} onChange={handleMethodChange}>
          <Tab label="GET" value="GET" />
          <Tab label="POST" value="POST" />
          <Tab label="PUT" value="PUT" />
          <Tab label="DELETE" value="DELETE" />
        </Tabs>
        <TextField
          defaultValue={"/"}
          onChange={(value) => {
            setPath(value.target.value);
          }}
        />
        <Button onClick={handleRun}>Call</Button>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Container>
    </Navigation>
  );
}
