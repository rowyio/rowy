import React from "react";
import { useForm } from "react-hook-form";
import { IMenuModalProps } from "..";

import {
  makeStyles,
  createStyles,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import Subheading from "../Subheading";

import { getFieldProp } from "components/fields";
import CodeEditor from "components/CodeEditor";
import FormAutosave from "./FormAutosave";

const useStyles = makeStyles((theme) =>
  createStyles({
    typeSelector: { marginBottom: theme.spacing(1) },
    helperText: {
      ...theme.typography.body2,
      marginTop: theme.spacing(1),
    },

    codeEditorContainer: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      overflow: "hidden",
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
  const customFieldInput = getFieldProp("SideDrawerField", type);

  const { control } = useForm({
    mode: "onBlur",
    defaultValues: {
      [fieldName]:
        config.defaultValue?.value ?? getFieldProp("initialValue", type),
    },
  });

  return (
    <>
      <Subheading>Default Value</Subheading>
      <Typography color="textSecondary" gutterBottom>
        The default value will be the initial value of the cells whenever a new
        row is added.
      </Typography>

      <TextField
        select
        label="Default Value Type"
        value={config.defaultValue?.type ?? "undefined"}
        onChange={(e) => handleChange("defaultValue.type")(e.target.value)}
        fullWidth
        FormHelperTextProps={{ classes: { root: classes.helperText } }}
        helperText={
          config.defaultValue?.type === "static"
            ? "The default value will be set when you click “Add Row”. No further setup is required."
            : config.defaultValue?.type === "dynamic"
            ? "The default value will be evaluated and set by this table’s Firetable cloud function. Setup is required."
            : ""
        }
        className={classes.typeSelector}
      >
        <MenuItem value="undefined">Undefined</MenuItem>
        <MenuItem value="null">Null</MenuItem>
        <MenuItem value="static">Static</MenuItem>
        <MenuItem value="dynamic">
          Dynamic<em>(requires FT Cloud functions)</em>
        </MenuItem>
      </TextField>

      {config.defaultValue?.type === "static" && customFieldInput && (
        <form>
          <FormAutosave
            control={control}
            handleSave={(values) =>
              handleChange("defaultValue.value")(values[fieldName])
            }
          />

          {React.createElement(customFieldInput, {
            column: { type, key: fieldName, ...props, ...config },
            control,
            docRef: {},
            disabled: false,
          })}
        </form>
      )}

      {config.defaultValue?.type === "dynamic" && (
        <div className={classes.codeEditorContainer}>
          <CodeEditor
            height={120}
            value={config.defaultValue?.script}
            onChange={handleChange("defaultValue.script")}
            editorOptions={{
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
      )}
    </>
  );
}
