import React from "react";
import { useForm } from "react-hook-form";
import { IMenuModalProps } from "..";

import { makeStyles, createStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography, TextField, MenuItem, ListItemText } from "@mui/material";
import Subheading from "../Subheading";

import { getFieldProp } from "components/fields";
import CodeEditorHelper from "components/CodeEditorHelper";
import CodeEditor from "components/Table/editors/CodeEditor";
import FormAutosave from "./FormAutosave";
import { FieldType } from "constants/fields";
import { WIKI_LINKS } from "constants/externalLinks";
import { name } from "@root/package.json";

const useStyles = makeStyles((theme) =>
  createStyles({
    typeSelect: { marginBottom: theme.spacing(1) },
    typeSelectItem: { whiteSpace: "normal" },

    codeEditorContainer: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
    },

    mono: {
      fontFamily: theme.typography.fontFamilyMono,
    },
  })
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
  const classes = useStyles();
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
        className={classes.typeSelect}
      >
        <MenuItem value="undefined">
          <ListItemText
            primary="Undefined"
            secondary="No default value. The field will not appear in the row’s corresponding Firestore document by default."
            className={classes.typeSelectItem}
          />
        </MenuItem>
        <MenuItem value="null">
          <ListItemText
            primary="Null"
            secondary={
              <>
                Initialise as <span className={classes.mono}>null</span>.
              </>
            }
            className={classes.typeSelectItem}
          />
        </MenuItem>
        <MenuItem value="static">
          <ListItemText
            primary="Static"
            secondary="Set a specific default value for all cells in this column."
            className={classes.typeSelectItem}
          />
        </MenuItem>
        <MenuItem value="dynamic">
          <ListItemText
            primary={`Dynamic (Requires ${name} Cloud Functions)`}
            secondary={`Write code to set the default value using this table’s ${name} Cloud Function. Setup is required.`}
            className={classes.typeSelectItem}
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

          {React.createElement(customFieldInput, {
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
          <div className={classes.codeEditorContainer}>
            <CodeEditor
              height={120}
              script={config.defaultValue?.script}
              handleChange={handleChange("defaultValue.script")}
              editorOptions={{
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
