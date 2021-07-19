import React from "react";
import { useForm } from "react-hook-form";
import { IMenuModalProps } from "..";

import {
  makeStyles,
  createStyles,
  Typography,
  TextField,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import Subheading from "../Subheading";

import { getFieldProp } from "components/fields";
import CodeEditorHelper from "components/CodeEditorHelper";
import CodeEditor from "components/Table/editors/CodeEditor";
import FormAutosave from "./FormAutosave";
import { FieldType } from "constants/fields";
import WIKI_LINKS from "constants/wikiLinks";

const useStyles = makeStyles((theme) =>
  createStyles({
    typeSelect: { marginBottom: theme.spacing(1) },
    typeSelectItem: { whiteSpace: "normal" },

    codeEditorContainer: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      overflow: "hidden",
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
      <Subheading>Default Value</Subheading>
      <Typography color="textSecondary" gutterBottom>
        The default value will be the initial value of this cell when a new row
        is added.
      </Typography>

      <TextField
        select
        label="Default Value Type"
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
            primary="Dynamic (Requires Firetable Cloud Functions)"
            secondary="Write code to set the default value using this table’s Firetable Cloud Function. Setup is required."
            className={classes.typeSelectItem}
          />
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
            column: { type, key: fieldName, config, ...props, ...config },
            control,
            docRef: {},
            disabled: false,
          })}
        </form>
      )}

      {config.defaultValue?.type === "dynamic" && (
        <>
          <CodeEditorHelper docLink={WIKI_LINKS.defaultValues} />
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
        </>
      )}
    </>
  );
}
