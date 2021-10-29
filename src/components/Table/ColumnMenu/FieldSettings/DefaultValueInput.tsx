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

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

export interface IDefaultValueInputProps extends IMenuModalProps {
  handleChange: (key: any) => (update: any) => void;
}

export default function DefaultValueInput({
  config,
  handleChange,
  type,
  fieldName,
  ...props
}: IDefaultValueInputProps) {
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
        SelectProps={{
          MenuProps: {
            sx: { "& .MuiListItemText-root": { whiteSpace: "normal" } },
          },
        }}
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
        <MenuItem value="dynamic">
          <ListItemText
            primary={`Dynamic (Requires ${name} Cloud Functions)`}
            secondary={`Write code to set the default value using this table’s ${name} Cloud Function. Setup is required.`}
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
              value={config.defaultValue?.script}
              onChange={handleChange("defaultValue.script")}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
