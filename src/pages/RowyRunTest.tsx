import { useState } from "react";
import { useSnackbar } from "notistack";
import createPersistedState from "use-persisted-state";
import stringify from "json-stable-stringify-without-jsonify";

import {
  useTheme,
  Container,
  Grid,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
} from "@mui/material";

import Navigation from "@src/components/Navigation";
import CodeEditor from "@src/components/CodeEditor";
import ReactJson from "react-json-view";
import KeyValueInput from "@src/components/KeyValueInput";

// import { useConfirmation } from "@src/components/ConfirmationDialog";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { runRoutes } from "@src/constants/runRoutes";

const useBodyCacheState = createPersistedState("__ROWY__RR_TEST_REQ_BODY");

export default function TestView() {
  const theme = useTheme();

  const { rowyRun } = useProjectContext();
  // const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [localhost, setLocalhost] = useState(false);
  const [result, setResult] = useState<any>({});

  const [cachedBody, setCachedBody] = useBodyCacheState<any>();
  const [method, setMethod] = useState<"GET" | "POST" | "DELETE">("GET");
  const [path, setPath] = useState<string>("/");
  const [codeValid, setCodeValid] = useState(true);
  const [headers, setHeaders] = useState<Record<string, string>>({
    x: "1",
    y: "2",
    z: "3",
  });

  const cachedBodyKey = path.replace("/", "");

  const handleMethodChange = (_, newMethod) => setMethod(newMethod);
  const setDefinedRoute = (newPath) => {
    setPath(newPath.target.value);
    const _method = Object.values(runRoutes).find(
      (r) => r.path === path
    )?.method;
    if (_method) setMethod(_method);
  };

  const handleRun = async () => {
    if (!rowyRun) return;
    setLoading(true);
    const body =
      ["POST", "PUT"].includes(method) && cachedBody[cachedBodyKey]
        ? cachedBody[cachedBodyKey]
        : undefined;
    try {
      const resp = await rowyRun({
        route: {
          method,
          path,
        },
        body,
        localhost,
      });
      setResult(resp);
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navigation title="Rowy Run Sandbox">
      {loading && (
        <LinearProgress
          style={{ position: "fixed", top: 56, left: 0, right: 0 }}
        />
      )}

      <Container style={{ margin: "24px 0 200px" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={localhost ? "localhost" : "deployed"}
              onChange={(_, v) => setLocalhost(v === "localhost")}
            >
              <ToggleButton value="deployed">Deployed</ToggleButton>
              <ToggleButton value="localhost">Localhost</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item>
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={method}
              onChange={handleMethodChange}
            >
              <ToggleButton value="GET">GET</ToggleButton>
              <ToggleButton value="POST">POST</ToggleButton>
              <ToggleButton value="PUT">PUT</ToggleButton>
              <ToggleButton value="DELETE">DELETE</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs style={{ display: "flex" }}>
            <TextField
              aria-label="Defined route"
              id="definedRoute"
              select
              value={
                Object.values(runRoutes).find((r) => r.path === path)?.path ??
                ""
              }
              onChange={setDefinedRoute}
              SelectProps={{
                renderValue: () => (
                  <InputLabel style={{ cursor: "inherit", padding: 0 }}>
                    Defined route
                  </InputLabel>
                ),
                displayEmpty: true,
              }}
              className="labelHorizontal"
              sx={{
                flexShrink: 0,
                "& .MuiInputBase-root": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              {Object.values(runRoutes).map((route) => (
                <MenuItem key={route.path} value={route.path}>
                  {route.path}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              aria-label="Path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              sx={{
                minWidth: 200,
                flexGrow: 1,

                "& .MuiInputBase-root": {
                  mx: "-1px",
                  borderRadius: 0,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRun}
              style={{
                marginLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              Call
            </Button>
          </Grid>
        </Grid>

        {["POST", "PUT"].includes(method) && (
          <FormControl variant="filled" sx={{ my: 2, width: "100%" }}>
            <InputLabel>Body</InputLabel>

            <CodeEditor
              defaultLanguage="json"
              value={
                cachedBody && cachedBody[cachedBodyKey]
                  ? stringify(cachedBody[cachedBodyKey], { space: 2 })
                  : "{\n  \n}"
              }
              onChange={(v) => {
                try {
                  if (v) {
                    const parsed = JSON.parse(v);
                    setCachedBody((o) => ({ ...o, [cachedBodyKey]: parsed }));
                  }
                } catch (e) {
                  console.log(`Failed to parse JSON: ${e}`);
                  setCodeValid(false);
                }
              }}
              onValidStatusUpdate={({ isValid }) => setCodeValid(isValid)}
              error={!codeValid}
            />
            {!codeValid && (
              <FormHelperText error variant="filled">
                Invalid JSON
              </FormHelperText>
            )}
          </FormControl>
        )}

        {/* TODO: Remove */}
        <KeyValueInput
          value={headers}
          onChange={(v) => setHeaders(v)}
          label="Headers"
        />
        <code style={{ display: "block" }}>
          {JSON.stringify(headers, undefined, 2)}
        </code>

        <InputLabel sx={{ mb: 1, mt: 4 }}>Response</InputLabel>
        <Paper sx={{ p: 2 }}>
          <ReactJson
            src={result}
            name="body"
            theme={theme.palette.mode === "dark" ? "monokai" : "rjv-default"}
            iconStyle="triangle"
            style={{
              fontFamily: theme.typography.fontFamilyMono,
              backgroundColor: "transparent",
            }}
            quotesOnKeys={false}
            sortKeys
          />
        </Paper>
      </Container>
    </Navigation>
  );
}
