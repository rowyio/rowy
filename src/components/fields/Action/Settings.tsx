import { lazy, Suspense } from "react";
import {
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { InputLabel } from "@mui/material";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import { WIKI_LINKS } from "@src/constants/externalLinks";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const Settings = ({ config, onChange }) => {
  const { tableState, roles } = useProjectContext();
  const columnOptions = Object.values(tableState?.columns ?? {}).map((c) => ({
    label: c.name,
    value: c.key,
  }));
  return (
    <>
      <Typography variant="overline">Allowed roles</Typography>
      <Typography variant="body2">
        Authenticated user must have at least one of these to run the script
      </Typography>
      <MultiSelect
        label="Allowed roles"
        options={roles ?? []}
        value={config.requiredRoles ?? []}
        onChange={onChange("requiredRoles")}
      />

      <Typography variant="overline">Required fields</Typography>
      <Typography variant="body2">
        All of the selected fields must have a value for the script to run
      </Typography>

      <MultiSelect
        label="Required fields"
        options={columnOptions}
        value={config.requiredFields ?? []}
        onChange={onChange("requiredFields")}
      />
      <Divider />
      <Typography variant="overline">Confirmation template</Typography>
      <Typography variant="body2">
        The action button will not ask for confirmation if this is left empty
      </Typography>

      <TextField
        label="Confirmation template"
        placeholder="Are sure you want to invest {{stockName}}?"
        value={config.confirmation}
        onChange={(e) => {
          onChange("confirmation")(e.target.value);
        }}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={config.isActionScript}
            onChange={() =>
              onChange("isActionScript")(!Boolean(config.isActionScript))
            }
            name="actionScript"
          />
        }
        label="Set as an action script"
        sx={{
          alignItems: "center",
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />
      {!Boolean(config.isActionScript) ? (
        <TextField
          label="Callable name"
          name="callableName"
          value={config.callableName}
          fullWidth
          onChange={(e) => {
            onChange("callableName")(e.target.value);
          }}
        />
      ) : (
        <>
          <InputLabel>Action script</InputLabel>
          <CodeEditorHelper
            docLink={WIKI_LINKS.fieldTypesAction}
            additionalVariables={[]}
          />

          <Suspense fallback={<FieldSkeleton height={300} />}>
            <CodeEditor
              minHeight={300}
              value={config.script}
              extraLibs={[
                [
                  "declare class ref {",
                  "    /**",
                  "     * Reference object of the row running the action script",
                  "     */",
                  "static id:string",
                  "static path:string",
                  "static parentId:string",
                  "static tablePath:string",
                  "}",
                ].join("\n"),
                [
                  "declare class actionParams {",
                  "    /**",
                  "     * actionParams are provided by dialog popup form",
                  "     */",
                  (config.params ?? []).map((param) => {
                    const validationKeys = Object.keys(param.validation);
                    if (validationKeys.includes("string")) {
                      return `static ${param.name}:string`;
                    } else if (validationKeys.includes("array")) {
                      return `static ${param.name}:any[]`;
                    } else return `static ${param.name}:any`;
                  }),
                  "}",
                ].join("\n"),
              ]}
              onChange={onChange("script")}
            />
          </Suspense>
          <FormControlLabel
            control={
              <Switch
                checked={config.redo?.enabled}
                onChange={() =>
                  onChange("redo.enabled")(!Boolean(config.redo?.enabled))
                }
                name="redo toggle"
              />
            }
            label="User can redo (re-runs the same script)"
            sx={{
              alignItems: "center",
              "& .MuiFormControlLabel-label": { mt: 0 },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.undo?.enabled}
                onChange={() =>
                  onChange("undo.enabled")(!Boolean(config.undo?.enabled))
                }
                name="undo toggle"
              />
            }
            label="User can undo"
            sx={{
              alignItems: "center",
              "& .MuiFormControlLabel-label": { mt: 0 },
            }}
          />
          {config["undo.enabled"] && (
            <>
              <Typography variant="overline">
                Undo confirmation template
              </Typography>
              <TextField
                label="Template"
                placeholder="are you sure you want to sell your stocks in {{stockName}}"
                value={config["undo.confirmation"]}
                onChange={(e) => {
                  onChange("undo.confirmation")(e.target.value);
                }}
                fullWidth
              />
              <Typography variant="overline">Undo action script</Typography>
              <Suspense fallback={<FieldSkeleton height={300} />}>
                <CodeEditor
                  minHeight={300}
                  value={config["undo.script"]}
                  onChange={onChange("undo.script")}
                />
              </Suspense>
            </>
          )}
        </>
      )}
    </>
  );
};
export default Settings;
