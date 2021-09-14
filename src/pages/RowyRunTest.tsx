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
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import SparkIcon from "@mui/icons-material/OfflineBoltOutlined";
import { useConfirmation } from "components/ConfirmationDialog";

import SnackbarProgress, {
  ISnackbarProgressRef,
} from "components/SnackbarProgress";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { RunRoutes } from "@src/constants/runRoutes";

export default function TestView() {
  const theme = useTheme();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { rowyRun } = useProjectContext();
  const [result, setResult] = useState<any>({});

  const [method, setMethod] = useState<"GET" | "POST">("GET");
  const [path, setPath] = useState<string>("/");
  const handleMethodChange = (_, newMethod) => setMethod(newMethod);
  const setDefinedRoute = (newPath) => {
    setPath(newPath.target.value);
    const _method = Object.values(RunRoutes).find(
      (r) => r.path === path
    )?.method;
    if (_method) {
      setMethod(_method);
    }
  };
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
        <FormControl style={{ minWidth: 240 }}>
          <InputLabel>Defined Route</InputLabel>
          <Select
            value={
              Object.values(RunRoutes).find((r) => r.path === path)?.path ?? ""
            }
            onChange={setDefinedRoute}
          >
            {Object.values(RunRoutes).map((route) => (
              <MenuItem key={route.path} value={route.path}>
                {route.path}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tabs value={method} onChange={handleMethodChange}>
          <Tab label="GET" value="GET" />
          <Tab label="POST" value="POST" />
          <Tab label="PUT" value="PUT" />
          <Tab label="DELETE" value="DELETE" />
        </Tabs>
        <TextField
          value={path}
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
