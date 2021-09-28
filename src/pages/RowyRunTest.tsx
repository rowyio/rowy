import { useState } from "react";
import { useSnackbar } from "notistack";
import createPersistedState from "use-persisted-state";
import Navigation from "components/Navigation";
import ReactJson from "react-json-view";
import {
  useTheme,
  Container,
  Button,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useConfirmation } from "components/ConfirmationDialog";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { runRoutes } from "constants/runRoutes";

const useBodyCacheState = createPersistedState("__ROWY__RR_TEST_REQ_BODY");
export default function TestView() {
  const theme = useTheme();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [localhost, setLocalhost] = useState(false);
  const { rowyRun } = useProjectContext();
  const [result, setResult] = useState<any>({});

  const [cachedBody, setCachedBody] = useBodyCacheState<any>();
  const [method, setMethod] = useState<"GET" | "POST" | "DELETE">("GET");
  const [path, setPath] = useState<string>("/");
  const cachedBodyKey = path.replace("/", "");
  const handleMethodChange = (_, newMethod) => setMethod(newMethod);
  const setDefinedRoute = (newPath) => {
    setPath(newPath.target.value);
    const _method = Object.values(runRoutes).find(
      (r) => r.path === path
    )?.method;
    if (_method) {
      setMethod(_method);
    }
  };
  const handleEdit = (edit) =>
    setCachedBody((o) => ({ ...o, [cachedBodyKey]: edit.updated_src }));
  const handleRun = async () => {
    if (!rowyRun) return;
    setLoading(true);
    const body =
      ["POST", "PUT"].includes(method) && cachedBody[cachedBodyKey]
        ? cachedBody[cachedBodyKey]
        : undefined;
    const resp = await rowyRun({
      route: {
        method,
        path,
      },
      body,
      localhost,
    });
    setResult(resp);
    setLoading(false);
  };
  return (
    <Navigation title="Rowy Run Sandbox">
      {loading && (
        <LinearProgress
          style={{ position: "fixed", top: 56, left: 0, right: 0 }}
        />
      )}

      <Container style={{ margin: "24px 0 200px" }}>
        <FormControlLabel
          control={
            <Switch
              size="medium"
              onClick={() => {
                setLocalhost(!localhost);
              }}
            />
          }
          label="Localhost?"
        />
        <TextField
          label="Defined route"
          select
          value={
            Object.values(runRoutes).find((r) => r.path === path)?.path ?? ""
          }
          onChange={setDefinedRoute}
          style={{ width: 255 }}
        >
          {Object.values(runRoutes).map((route) => (
            <MenuItem key={route.path} value={route.path}>
              {route.path}
            </MenuItem>
          ))}
        </TextField>
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
        <br />
        {["POST", "PUT"].includes(method) && (
          <>
            <Typography variant="overline">Body</Typography>
            <ReactJson
              src={
                cachedBody && cachedBody[cachedBodyKey]
                  ? cachedBody[cachedBodyKey]
                  : {}
              }
              onEdit={handleEdit}
              onAdd={handleEdit}
              onDelete={handleEdit}
              theme={{
                base00: "rgba(0, 0, 0, 0)",
                base01: theme.palette.background.default,
                base02: theme.palette.divider,
                base03: "#93a1a1",
                base04: theme.palette.text.disabled,
                base05: theme.palette.text.secondary,
                base06: "#073642",
                base07: theme.palette.text.primary,
                base08: "#d33682",
                base09: "#cb4b16",
                base0A: "#dc322f",
                base0B: "#859900",
                base0C: "#6c71c4",
                base0D: theme.palette.text.secondary,
                base0E: "#2aa198",
                base0F: "#268bd2",
              }}
              iconStyle="triangle"
              style={{
                fontFamily: theme.typography.fontFamilyMono,
                backgroundColor: "transparent",
              }}
            />
          </>
        )}
        <Typography variant="overline">Result</Typography>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Container>
    </Navigation>
  );
}
