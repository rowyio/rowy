import { lazy, Suspense, createElement } from "react";
import { useForm } from "react-hook-form";
import { IMenuModalProps } from "..";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography, TextField, MenuItem, ListItemText } from "@mui/material";

import { getFieldProp } from "@src/components/fields";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import FormAutosave from "./FormAutosave";
import { FieldType } from "@src/constants/fields";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import { name } from "@root/package.json";
/* eslint-disable import/no-webpack-loader-syntax */
import defaultValueDefs from "!!raw-loader!./defaultValue.d.ts";
import { useProjectContext } from "@src/contexts/ProjectContext";
const _CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export interface IDefaultValueInputProps extends IMenuModalProps {
  handleChange: (key: any) => (update: any) => void;
}

const CodeEditor = ({ type, config, handleChange }) => {
  const { compatibleRowyRunVersion } = useProjectContext();
  const functionBodyOnly = compatibleRowyRunVersion!({ maxVersion: "1.3.10" });
  const returnType = getFieldProp("dataType", type) ?? "any";

  const dynamicValueFn = functionBodyOnly
    ? config.defaultValue?.script
    : config.defaultValue?.dynamicValueFn
    ? config.defaultValue?.dynamicValueFn
    : config.defaultValue?.script
    ? `const dynamicValueFn : DefaultValue = async ({row,ref,db,storage,auth})=>{
    ${config.defaultValue.script}
    }`
    : `const dynamicValueFn : DefaultValue = async ({row,ref,db,storage,auth})=>{
    // Write your default value code here
    // for example:
    // generate random hex color
    // const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    // return color;
    // checkout the documentation for more info: https://docs.rowy.io/how-to/default-values#dynamic
  }`;
  return (
    <_CodeEditor
      value={dynamicValueFn}
      diagnosticsOptions={functionBodyOnly ? undefined : diagnosticsOptions}
      extraLibs={[
        defaultValueDefs.replace(
          `"PLACEHOLDER_OUTPUT_TYPE"`,
          `${returnType} | Promise<${returnType}>`
        ),
      ]}
      onChange={handleChange(
        functionBodyOnly ? "defaultValue.script" : "defaultValue.dynamicValueFn"
      )}
    />
  );
};

export default function DefaultValueInput({
  config,
  handleChange,
  type,
  fieldName,
  ...props
}: IDefaultValueInputProps) {
  const { settings } = useProjectContext();

  const _type =
    type !== FieldType.derivative
      ? type
      : config.renderFieldType ?? FieldType.shortText;
  const customFieldInput = getFieldProp("SideDrawerField", _type);
  const { control } = useForm({
    mode: "onBlur",
    defaultValues: {
      [fieldName]:
        config.defaultValue?.value ?? getFieldProp("initialValue", _type),
    },
  });

  return (
    <>
      <TextField
        select
        label="Default value type"
        value={config.defaultValue?.type ?? "undefined"}
        onChange={(e) => handleChange("defaultValue.type")(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      >
        <MenuItem value="undefined">
          <ListItemText
            primary="Undefined"
            secondary="No default value. The field will not appear in the row’s corresponding Firestore document by default."
          />
        </MenuItem>
        <MenuItem value="null">
          <ListItemText
            primary="Null"
            secondary={
              <>
                Initialise as <code>null</code>.
              </>
            }
          />
        </MenuItem>
        <MenuItem value="static">
          <ListItemText
            primary="Static"
            secondary="Set a specific default value for all cells in this column."
          />
        </MenuItem>
        <MenuItem
          value="dynamic"
          disabled={!settings?.rowyRunUrl}
          sx={{
            "&.Mui-disabled": { opacity: 1, color: "text.disabled" },
            "&.Mui-disabled .MuiListItemText-secondary": {
              color: "text.disabled",
            },
          }}
        >
          <ListItemText
            primary={
              settings?.rowyRunUrl ? (
                "Dynamic"
              ) : (
                <>
                  Dynamic —{" "}
                  <Typography color="error" variant="inherit" component="span">
                    Requires Rowy Run setup
                  </Typography>
                </>
              )
            }
            secondary="Write code to set the default value using Rowy Run"
          />
        </MenuItem>
      </TextField>
      {(!config.defaultValue || config.defaultValue.type === "undefined") && (
        <>
          <FormControlLabel
            value="required"
            label={
              <>
                Make this column required
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  The row will not be created or updated unless all required
                  values are set.
                </Typography>
              </>
            }
            control={
              <Checkbox
                checked={config.required}
                onChange={(e) => handleChange("required")(e.target.checked)}
                name="required"
              />
            }
          />
        </>
      )}
      {config.defaultValue?.type === "static" && customFieldInput && (
        <form>
          <FormAutosave
            control={control}
            handleSave={(values) =>
              handleChange("defaultValue.value")(values[fieldName])
            }
          />

          {createElement(customFieldInput, {
            column: { type, key: fieldName, config, ...props, ...config },
            control,
            docRef: {},
            disabled: false,
          })}
        </form>
      )}

      {config.defaultValue?.type === "dynamic" && (
        <>
          <CodeEditorHelper docLink={WIKI_LINKS.howToDefaultValues} />
          <Suspense fallback={<FieldSkeleton height={100} />}>
            <CodeEditor
              config={config}
              type={type}
              handleChange={handleChange}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
