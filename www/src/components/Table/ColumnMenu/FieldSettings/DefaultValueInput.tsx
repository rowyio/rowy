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
  Box,
  Tooltip,
  Button,
} from "@material-ui/core";
import Subheading from "../Subheading";

import { getFieldProp } from "components/fields";
import CodeEditor from "components/Table/editors/CodeEditor";
import FormAutosave from "./FormAutosave";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/FiretableContext";
import OpenIcon from "@material-ui/icons/OpenInNew";

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
  const { tableState } = useFiretableContext();

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
          <Box marginBottom={1} display="flex" justifyContent="space-between">
            <Box>
              You have access to:{" "}
              <Tooltip
                style={{
                  zIndex: 9999,
                }}
                title={
                  <>
                    You have acces to the object "row" at the top level. Typing
                    "row" in the code editor to get auto completion. Below are
                    the fields of row you can use in this table:
                    <br />
                    <br />
                    {Object.keys(tableState?.columns!).join(", ")}
                  </>
                }
              >
                <span>row</span>
              </Tooltip>
              ,{" "}
              <Tooltip
                style={{
                  zIndex: 9999,
                }}
                title={
                  <>
                    You have acces to the db object that represents the
                    firestore database object. Typing "db" in the code editor to
                    get auto completion.
                  </>
                }
              >
                <span>db</span>
              </Tooltip>
            </Box>
            <Button
              size="small"
              endIcon={<OpenIcon />}
              target="_blank"
              href="https://github.com/FiretableProject/firetable/wiki/Getting-Started" // TODO add doc link
            >
              Examples & Docs
            </Button>
          </Box>
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
