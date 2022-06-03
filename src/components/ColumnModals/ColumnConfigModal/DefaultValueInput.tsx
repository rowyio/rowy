import { lazy, Suspense, createElement } from "react";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography, TextField, MenuItem, ListItemText } from "@mui/material";

import { getFieldProp } from "@src/components/fields";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import FormAutosave from "./FormAutosave";
import { FieldType } from "@src/constants/fields";
import { WIKI_LINKS } from "@src/constants/externalLinks";

/* eslint-disable import/no-webpack-loader-syntax */
import defaultValueDefs from "!!raw-loader!./defaultValue.d.ts";
import {
  globalScope,
  compatibleRowyRunVersionAtom,
  projectSettingsAtom,
} from "@src/atoms/globalScope";
import { ColumnConfig } from "@src/types/table";

const CodeEditorComponent = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

interface ICodeEditorProps {
  type: FieldType;
  column: ColumnConfig;
  handleChange: (key: string) => (update: string | undefined) => void;
}

function CodeEditor({ type, column, handleChange }: ICodeEditorProps) {
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    globalScope
  );

  const functionBodyOnly = compatibleRowyRunVersion!({ maxVersion: "1.3.10" });
  const returnType = getFieldProp("dataType", type) ?? "any";

  let dynamicValueFn = "";
  if (functionBodyOnly) {
    dynamicValueFn = column.config?.defaultValue?.script || "";
  } else if (column.config?.defaultValue?.dynamicValueFn) {
    dynamicValueFn = column.config?.defaultValue?.dynamicValueFn;
  } else if (column.config?.defaultValue?.script) {
    dynamicValueFn = `const dynamicValueFn : DefaultValue = async ({row,ref,db,storage,auth})=>{
    ${column.config?.defaultValue.script}
    }`;
  } else {
    dynamicValueFn = `const dynamicValueFn : DefaultValue = async ({row,ref,db,storage,auth})=>{
      // Write your default value code here
      // for example:
      // generate random hex color
      // const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      // return color;
      // checkout the documentation for more info: https://docs.rowy.io/how-to/default-values#dynamic
    }`;
  }

  return (
    <CodeEditorComponent
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
}

export interface IDefaultValueInputProps {
  handleChange: (key: string) => (update: any) => void;
  column: ColumnConfig;
}

export default function DefaultValueInput({
  handleChange,
  column,
}: IDefaultValueInputProps) {
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);

  const _type =
    column.type !== FieldType.derivative
      ? column.type
      : column.config?.renderFieldType ?? FieldType.shortText;
  const customFieldInput = getFieldProp("SideDrawerField", _type);
  const { control } = useForm({
    mode: "onBlur",
    defaultValues: {
      [column.fieldName]:
        column.config?.defaultValue?.value ??
        getFieldProp("initialValue", _type),
    },
  });

  return (
    <>
      <TextField
        select
        label="Default value type"
        value={column.config?.defaultValue?.type ?? "undefined"}
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
          disabled={!projectSettings.rowyRunUrl}
          sx={{
            "&.Mui-disabled": { opacity: 1, color: "text.disabled" },
            "&.Mui-disabled .MuiListItemText-secondary": {
              color: "text.disabled",
            },
          }}
        >
          <ListItemText
            primary={
              projectSettings.rowyRunUrl ? (
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
      {(!column.config?.defaultValue ||
        column.config?.defaultValue.type === "undefined") && (
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
                checked={column.config?.required}
                onChange={(e) => handleChange("required")(e.target.checked)}
                name="required"
              />
            }
          />
        </>
      )}
      {column.config?.defaultValue?.type === "static" && customFieldInput && (
        <form>
          <FormAutosave
            control={control}
            handleSave={(values) =>
              handleChange("defaultValue.value")(values[column.fieldName])
            }
          />

          {createElement(customFieldInput, {
            column,
            control,
            docRef: {},
            disabled: false,
          })}
        </form>
      )}

      {column.config?.defaultValue?.type === "dynamic" && (
        <>
          <CodeEditorHelper docLink={WIKI_LINKS.howToDefaultValues} />
          <Suspense fallback={<FieldSkeleton height={100} />}>
            <CodeEditor
              column={column}
              type={column.type}
              handleChange={handleChange}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
