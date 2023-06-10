import { lazy, Suspense, useState, useEffect } from "react";
import { get } from "lodash-es";
import stringify from "json-stable-stringify-without-jsonify";
import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";

import {
  Stack,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  InputLabel,
  Link as MuiLink,
  Checkbox,
  FormHelperText,
  Fab,
} from "@mui/material";
import RunIcon from "@mui/icons-material/PlayArrow";
import RedoIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";

import SteppedAccordion from "@src/components/SteppedAccordion";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import FormFieldSnippets from "./FormFieldSnippets";

import {
  projectScope,
  projectIdAtom,
  projectRolesAtom,
  projectSettingsAtom,
  compatibleRowyRunVersionAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";
import { WIKI_LINKS } from "@src/constants/externalLinks";

import actionDefs from "./action.d.ts?raw";
import { RUN_ACTION_TEMPLATE, UNDO_ACTION_TEMPLATE } from "./templates";
import { ROUTES } from "@src/constants/routes";
import { ISettingsProps } from "@src/components/fields/types";

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const Settings = ({ config, onChange, fieldName }: ISettingsProps) => {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [roles] = useAtom(projectRolesAtom, projectScope);
  const [settings] = useAtom(projectSettingsAtom, projectScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  useEffect(() => {
    if (!settings.rowyRunUrl) openRowyRunModal({ feature: "Action fields" });
  }, [settings.rowyRunUrl]);

  // const [activeStep, setActiveStep] = useState<
  //   "requirements" | "friction" | "action" | "undo" | "customization"
  // >("requirements");
  const functionBodyOnly = compatibleRowyRunVersion!({ maxVersion: "1.3.10" });
  // const steps =
  //   config.isActionScript && get(config, "undo.enabled")
  //     ? ["requirements", "friction", "action", "undo", "customization"]
  //     : ["requirements", "friction", "action", "customization"];

  const columnOptions = tableColumnsOrdered
    .map((c) => ({
      label: c.name,
      value: c.key,
    }))
    .filter((c) => c.value !== fieldName);

  const formattedParamsJson = stringify(
    Array.isArray(config.params) ? config.params : [],
    { space: 2 }
  );
  const [codeErrorMessage, setCodeErrorMessage] = useState<string | null>(null);

  const scriptExtraLibs = [
    [
      "declare interface actionParams {",
      "    /**",
      "     * actionParams are provided by dialog popup form",
      "     */",
      (Array.isArray(config.params) ? config.params : [])
        .filter(Boolean)
        .map((param: any) => {
          const validationKeys = Object.keys(param.validation ?? {});
          if (validationKeys.includes("string")) {
            return `static ${param.name}: string`;
          } else if (validationKeys.includes("array")) {
            return `static ${param.name}: any[]`;
          } else return `static ${param.name}: any`;
        }),
      "}",
    ].join("\n"),
    actionDefs,
  ];

  // Backwards-compatibility: previously user could set `confirmation` without
  // having to set `friction: confirmation`
  const showConfirmationField =
    config.friction === "confirmation" ||
    (!config.friction &&
      typeof config.confirmation === "string" &&
      config.confirmation !== "");

  const runFn = functionBodyOnly
    ? config?.script
    : config?.runFn
    ? config.runFn
    : config?.script
    ? `const action:Action = async ({row,ref,db,storage,auth,actionParams,user,logging}) => {
      ${config.script.replace(/utilFns.getSecret/g, "rowy.secrets.get")}
    }`
    : RUN_ACTION_TEMPLATE;

  const undoFn = functionBodyOnly
    ? get(config, "undo.script")
    : config.undoFn
    ? config.undoFn
    : get(config, "undo.script")
    ? `const action : Action = async ({row,ref,db,storage,auth,actionParams,user,logging}) => {
    ${get(config, "undo.script")}
  }`
    : UNDO_ACTION_TEMPLATE;
  return (
    <SteppedAccordion
      steps={[
        {
          id: "requirements",
          title: "Requirements",
          content: (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MultiSelect
                  label="Required roles"
                  labelPlural="roles"
                  options={roles ?? []}
                  value={config.requiredRoles ?? []}
                  onChange={onChange("requiredRoles")}
                  TextFieldProps={{
                    id: "requiredRoles",
                    helperText:
                      "The user must have at least one of these roles to run the script",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultiSelect
                  label="Required fields"
                  labelPlural="fields"
                  options={columnOptions}
                  value={config.requiredFields ?? []}
                  onChange={onChange("requiredFields")}
                  TextFieldProps={{
                    id: "requiredFields",
                    helperText:
                      "All the selected fields must have a value for the script to run",
                  }}
                />
              </Grid>
            </Grid>
          ),
        },
        {
          id: "confirmation",
          title: "Confirmation",
          content: (
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Clicking the action button will:
                </FormLabel>

                <RadioGroup
                  aria-label="Action button friction"
                  name="friction"
                  defaultValue={
                    typeof config.confirmation === "string" &&
                    config.confirmation !== ""
                      ? "confirmation"
                      : "none"
                  }
                  value={config.friction}
                  onChange={(e) => onChange("friction")(e.target.value)}
                >
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="Run the action immediately"
                  />
                  <FormControlLabel
                    value="confirmation"
                    control={<Radio />}
                    label="Ask the user for confirmation"
                  />
                  <FormControlLabel
                    value="params"
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="inherit">
                          Ask the user for input in a form (Alpha)
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          This feature is currently undocumented and is subject
                          to change in future minor versions
                        </Typography>
                      </>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {showConfirmationField && (
                <TextField
                  id="confirmation"
                  label="Confirmation template"
                  placeholder="Are sure you want to invest {{stockName}}?"
                  value={config.confirmation}
                  onChange={(e) => onChange("confirmation")(e.target.value)}
                  fullWidth
                  helperText="The action button will not ask for confirmation if this is left empty"
                />
              )}

              {config.friction === "params" && (
                <FormControl>
                  <Grid container spacing={1} sx={{ mb: 0.5 }}>
                    <Grid item xs>
                      <InputLabel variant="filled">Form fields</InputLabel>
                    </Grid>
                    <Grid item>
                      <FormFieldSnippets />
                    </Grid>
                  </Grid>

                  <Suspense fallback={<FieldSkeleton height={300} />}>
                    <CodeEditor
                      minHeight={200}
                      defaultLanguage="json"
                      value={formattedParamsJson}
                      onChange={(v) => {
                        try {
                          const parsed = JSON.parse(v ?? "");
                          if (Array.isArray(parsed)) {
                            onChange("params")(parsed);
                            setCodeErrorMessage(null);
                          } else {
                            setCodeErrorMessage("Form fields must be array");
                          }
                        } catch (e) {
                          console.log(`Failed to parse JSON: ${e}`);
                          setCodeErrorMessage("Invalid JSON");
                        }
                      }}
                      error={!!codeErrorMessage}
                    />
                  </Suspense>

                  {codeErrorMessage && (
                    <FormHelperText error variant="filled">
                      {codeErrorMessage}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Stack>
          ),
        },
        {
          id: "action",
          title: "Action",
          content: (
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Clicking the action button will run a:
                </FormLabel>
                <RadioGroup
                  aria-label="Action will run"
                  name="isActionScript"
                  value={
                    config.isActionScript !== false
                      ? "actionScript"
                      : "cloudFunction"
                  }
                  onChange={(e) =>
                    onChange("isActionScript")(
                      e.target.value === "actionScript"
                    )
                  }
                >
                  <FormControlLabel
                    value="actionScript"
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="inherit">Script</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Write JavaScript code below that will be executed by
                          Rowy Run.{" "}
                          {!settings?.rowyRunUrl && (
                            <MuiLink
                              component={Link}
                              to={ROUTES.projectSettings + "#rowyRun"}
                              color="error"
                            >
                              Requires Rowy Run setup&nbsp;→
                            </MuiLink>
                          )}
                        </Typography>
                      </>
                    }
                    disabled={!settings?.rowyRunUrl}
                  />
                  <FormControlLabel
                    value="cloudFunction"
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="inherit">Callable</Typography>
                        <Typography variant="caption" color="textSecondary">
                          A{" "}
                          <MuiLink
                            href="https://firebase.google.com/docs/functions/callable"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            callable function
                            <InlineOpenInNewIcon />
                          </MuiLink>{" "}
                          you’ve deployed on your Firestore or Google Cloud
                          project
                        </Typography>
                      </>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {config.isActionScript === false ? (
                <TextField
                  id="callableName"
                  label="Callable name"
                  name="callableName"
                  value={config.callableName}
                  fullWidth
                  onChange={(e) => onChange("callableName")(e.target.value)}
                  helperText={
                    <>
                      Write the name of the callable function you’ve deployed to
                      your project.{" "}
                      <MuiLink
                        href={`https://console.firebase.google.com/project/${projectId}/functions/list`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View your callable functions
                        <InlineOpenInNewIcon />
                      </MuiLink>
                      <br />
                      Your callable function must be compatible with Rowy Action
                      columns.{" "}
                      <MuiLink
                        href={WIKI_LINKS.fieldTypesAction + "#callable"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View requirements
                        <InlineOpenInNewIcon />
                      </MuiLink>
                    </>
                  }
                />
              ) : (
                <>
                  <FormControl>
                    <InputLabel variant="filled">Action script</InputLabel>
                    <Suspense fallback={<FieldSkeleton height={300} />}>
                      <CodeEditor
                        minHeight={200}
                        value={runFn}
                        onChange={
                          functionBodyOnly
                            ? onChange("script")
                            : onChange("runFn")
                        }
                        extraLibs={scriptExtraLibs}
                        diagnosticsOptions={
                          functionBodyOnly ? undefined : diagnosticsOptions
                        }
                      />
                    </Suspense>
                    <CodeEditorHelper
                      docLink={WIKI_LINKS.fieldTypesAction + "#script"}
                      additionalVariables={[
                        {
                          key: "row",
                          description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
                        },
                        {
                          key: "ref",
                          description: `reference object that represents the reference to the current row in firestore db (ie: doc.ref).`,
                        },
                      ]}
                    />
                  </FormControl>

                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={config.redo?.enabled}
                            onChange={() =>
                              onChange("redo.enabled")(
                                !Boolean(config.redo?.enabled)
                              )
                            }
                            name="redo"
                          />
                        }
                        label={
                          <>
                            <Typography variant="inherit">
                              User can redo
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Re-runs the script above
                            </Typography>
                          </>
                        }
                        style={{ marginLeft: -11 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={config.undo?.enabled}
                            onChange={() =>
                              onChange("undo.enabled")(
                                !Boolean(config.undo?.enabled)
                              )
                            }
                            name="undo"
                          />
                        }
                        label={
                          <>
                            <Typography variant="inherit">
                              User can undo
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Runs a new script
                            </Typography>
                          </>
                        }
                        style={{ marginLeft: -11 }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Stack>
          ),
        },
        config.isActionScript !== false &&
          get(config, "undo.enabled") && {
            id: "undo",
            title: "Undo action",
            content: (
              <Stack spacing={3}>
                {(showConfirmationField ||
                  !config.friction ||
                  config.friction === "none") && (
                  <TextField
                    id="undo.confirmation"
                    label="Undo confirmation template"
                    placeholder="Are you sure you want to sell your stocks in {{stockName}}?"
                    value={get(config, "undo.confirmation")}
                    onChange={(e) => {
                      onChange("undo.confirmation")(e.target.value);
                    }}
                    fullWidth
                    helperText={
                      <>
                        {showConfirmationField &&
                          "Override the confirmation message above. "}
                        The action button will not ask for confirmation if this
                        is left empty{showConfirmationField && "."}
                      </>
                    }
                  />
                )}

                <FormControl>
                  <InputLabel variant="filled">Undo script</InputLabel>
                  <Suspense fallback={<FieldSkeleton height={300} />}>
                    <CodeEditor
                      value={undoFn}
                      onChange={
                        functionBodyOnly
                          ? onChange("undo.script")
                          : onChange("undoFn")
                      }
                      extraLibs={scriptExtraLibs}
                      diagnosticsOptions={
                        functionBodyOnly ? undefined : diagnosticsOptions
                      }
                    />
                  </Suspense>
                  <CodeEditorHelper
                    docLink={WIKI_LINKS.fieldTypesAction + "#script"}
                    additionalVariables={[
                      {
                        key: "row",
                        description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
                      },
                      {
                        key: "ref",
                        description: `reference object that represents the reference to the current row in firestore db (ie: doc.ref).`,
                      },
                    ]}
                  />
                </FormControl>
              </Stack>
            ),
          },
        {
          id: "customization",
          title: "Customization",
          content: (
            <>
              <Stack>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.customName?.enabled}
                      onChange={(e) =>
                        onChange("customName.enabled")(e.target.checked)
                      }
                      name="customName.enabled"
                    />
                  }
                  label="Customize label for action"
                  style={{ marginLeft: -11 }}
                />
                {config.customName?.enabled && (
                  <TextField
                    id="customName.actionName"
                    value={get(config, "customName.actionName")}
                    onChange={(e) =>
                      onChange("customName.actionName")(e.target.value)
                    }
                    label="Action name:"
                    className="labelHorizontal"
                    inputProps={{ style: { width: "10ch" } }}
                  ></TextField>
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.customIcons?.enabled}
                      onChange={(e) =>
                        onChange("customIcons.enabled")(e.target.checked)
                      }
                      name="customIcons.enabled"
                    />
                  }
                  label="Customize button icons with emoji"
                  style={{ marginLeft: -11 }}
                />
              </Stack>
              {config.customIcons?.enabled && (
                <Grid container spacing={2} sx={{ mt: { xs: 0, sm: -1 } }}>
                  <Grid item xs={12} sm={true}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        id="customIcons.run"
                        value={get(config, "customIcons.run")}
                        onChange={(e) =>
                          onChange("customIcons.run")(e.target.value)
                        }
                        label="Run:"
                        className="labelHorizontal"
                        inputProps={{ style: { width: "3ch" } }}
                      />
                      <Fab size="small" aria-label="Preview of run button">
                        {get(config, "customIcons.run") || <RunIcon />}
                      </Fab>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={true}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        id="customIcons.redo"
                        value={get(config, "customIcons.redo")}
                        onChange={(e) =>
                          onChange("customIcons.redo")(e.target.value)
                        }
                        label="Redo:"
                        className="labelHorizontal"
                        inputProps={{ style: { width: "3ch" } }}
                      />
                      <Fab size="small" aria-label="Preview of redo button">
                        {get(config, "customIcons.redo") || <RedoIcon />}
                      </Fab>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={true}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        id="customIcons.undo"
                        value={get(config, "customIcons.undo")}
                        onChange={(e) =>
                          onChange("customIcons.undo")(e.target.value)
                        }
                        label="Undo:"
                        className="labelHorizontal"
                        inputProps={{ style: { width: "3ch" } }}
                      />
                      <Fab size="small" aria-label="Preview of undo button">
                        {get(config, "customIcons.undo") || <UndoIcon />}
                      </Fab>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </>
          ),
        },
      ].filter(Boolean)}
    />
  );
};
export default Settings;
