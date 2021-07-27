import { useState, lazy, Suspense } from "react";
import {
  Typography,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from "@material-ui/core";
import MultiSelect from "@antlerengineering/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { useFiretableContext } from "contexts/FiretableContext";

const CodeEditor = lazy(
  () =>
    import(
      "components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */
    )
);

const Settings = ({ config, handleChange }) => {
  const { tableState, roles } = useFiretableContext();
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
        label={"Allowed Roles"}
        options={roles ?? []}
        value={config.requiredRoles ?? []}
        onChange={handleChange("requiredRoles")}
      />

      <Typography variant="overline">Required fields</Typography>
      <Typography variant="body2">
        All of the selected fields must have a value for the script to run
      </Typography>

      <MultiSelect
        label={"Required fields"}
        options={columnOptions}
        value={config.requiredFields ?? []}
        onChange={handleChange("requiredFields")}
      />
      <Divider />
      <Typography variant="overline">Confirmation Template</Typography>
      <Typography variant="body2">
        The action button will not ask for confirmation if this is left empty
      </Typography>

      <TextField
        label="Confirmation Template"
        placeholder="Are sure you want to invest {{stockName}}?"
        value={config.confirmation}
        onChange={(e) => {
          handleChange("confirmation")(e.target.value);
        }}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={config.isActionScript}
            onChange={() =>
              handleChange("isActionScript")(!Boolean(config.isActionScript))
            }
            name="actionScript"
          />
        }
        label="Set as an action script"
      />
      {!Boolean(config.isActionScript) ? (
        <TextField
          label="callable name"
          name="callableName"
          value={config.callableName}
          fullWidth
          onChange={(e) => {
            handleChange("callableName")(e.target.value);
          }}
        />
      ) : (
        <>
          <Typography variant="overline">action script</Typography>
          <Suspense fallback={<FieldSkeleton height={300} />}>
            <CodeEditor
              height={300}
              script={config.script}
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
                ],
              ]}
              handleChange={handleChange("script")}
            />
          </Suspense>
          <FormControlLabel
            control={
              <Switch
                checked={config.redo?.enabled}
                onChange={() =>
                  handleChange("redo.enabled")(!Boolean(config.redo?.enabled))
                }
                name="redo toggle"
              />
            }
            label="enable redo(reruns the same script)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.undo?.enabled}
                onChange={() =>
                  handleChange("undo.enabled")(!Boolean(config.undo?.enabled))
                }
                name="undo toggle"
              />
            }
            label="enable undo"
          />
          {config["undo.enabled"] && (
            <>
              <Typography variant="overline">
                Undo Confirmation Template
              </Typography>
              <TextField
                label="template"
                placeholder="are you sure you want to sell your stocks in {{stockName}}"
                value={config["undo.confirmation"]}
                onChange={(e) => {
                  handleChange("undo.confirmation")(e.target.value);
                }}
                fullWidth
              />
              <Typography variant="overline">Undo Action script</Typography>
              <Suspense fallback={<FieldSkeleton height={300} />}>
                <CodeEditor
                  height={300}
                  script={config["undo.script"]}
                  handleChange={handleChange("undo.script")}
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
