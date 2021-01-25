import React from "react";

import {
  makeStyles,
  createStyles,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import Subheading from "../Subheading";

import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";
import CodeEditor from "components/CodeEditor";

const useStyles = makeStyles((theme) =>
  createStyles({
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

export interface IDefaultValueInputProps {
  fieldType: FieldType;
  config: Record<string, any>;
  handleChange: (key: any) => (update: any) => void;
}

export default function DefaultValueInput({
  config,
  handleChange,
  fieldType,
}: IDefaultValueInputProps) {
  const classes = useStyles();
  const customFieldInput = getFieldProp("SideDrawerField", fieldType);

  return (
    <>
      <Subheading>Default Value</Subheading>
      <Typography color="textSecondary" paragraph>
        The default value will be the initial value of the cells whenever a new
        row is added.
      </Typography>

      <TextField
        select
        label="Default Value Type"
        value={config.initialValue?.type ?? ""}
        onChange={(e) => handleChange("initialValue.type")(e.target.value)}
        fullWidth
        FormHelperTextProps={{ classes: { root: classes.helperText } }}
        helperText={
          config.initialValue?.type === "static"
            ? "The default value will be set when you click “Add Row”. No further setup is required."
            : config.initialValue?.type === "dynamic"
            ? "The default value will be evaluated and set by this table’s Firetable cloud function. Setup is required."
            : ""
        }
      >
        <MenuItem value="static">Static</MenuItem>
        <MenuItem value="dynamic">Dynamic</MenuItem>
      </TextField>

      {/* {config.initialValue?.type === "static" && customFieldInput && (
        <form>
          {React.createElement(customFieldInput, {
            column: {},
            control,
            docRef: {},
            disabled: false,
          })}
        </form>
      )} */}

      {config.initialValue?.type === "dynamic" && (
        <div className={classes.codeEditorContainer}>
          <CodeEditor
            height={120}
            value={config["initialValue.script"]}
            onChange={handleChange("initialValue.script")}
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
