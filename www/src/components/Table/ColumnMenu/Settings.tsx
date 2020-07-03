import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Typography, IconButton, TextField, Switch } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FieldType } from "constants/fields";
import FieldsDropdown from "./FieldsDropdown";
import OptionsInput from "./ConfigFields/OptionsInput";
import { useFiretableContext } from "contexts/firetableContext";
import MultiSelect from "@antlerengineering/multiselect";

const ColumnSelector = ({ columns, handleChange, validTypes }) => {
  const options = columns
    .filter(col => validTypes.includes(col.type))
    .map(col => ({ value: col.key, label: col.name }));
  return <MultiSelect onChange={handleChange} value={[]} options={options} />;
};

const ConfigForm = ({ type, config, handleChange }) => {
  const { tableState, tables } = useFiretableContext();
  console.log(tables);
  if (!tableState) return <></>;

  switch (type) {
    case FieldType.singleSelect:
    case FieldType.multiSelect:
      const { columns } = tableState;
      return (
        <>
          <OptionsInput
            options={config.options ?? []}
            handleChange={handleChange("options")}
          />
          <Typography variant="overline">ADD NEW?</Typography>
          <Grid container direction="row" justify="space-between">
            <Typography variant="subtitle1">
              User can add new options.
            </Typography>
            <Switch
              checked={config.freeText}
              onClick={() => {
                handleChange("freeText")(!config.freeText);
              }}
            />
          </Grid>
        </>
      );
    case FieldType.subTable:
      return (
        <ColumnSelector
          columns={columns ?? []}
          handleChange={handleChange("parentLabel")}
          validTypes={[FieldType.shortText, FieldType.singleSelect]}
        />
      );

    default:
      return <></>;
  }
};

export default function FormDialog({
  name,
  fieldName,
  type,
  open,
  config,
  handleClose,
  handleSave,
}: {
  name: string;
  fieldName: string;
  type: FieldType;
  open: boolean;
  config: any;
  handleClose: Function;
  handleSave: Function;
}) {
  const [newConfig, setNewConfig] = useState(config ?? {});

  return (
    <div>
      <Dialog
        open={open}
        onClose={(e, r) => {
          handleClose();
        }}
        aria-labelledby="form-column-settings"
      >
        <DialogContent>
          <Grid
            container
            justify="space-between"
            alignContent="flex-start"
            direction="row"
          >
            <Typography variant="h6">{name}: Settings</Typography>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography variant="overline"></Typography>

          {
            <ConfigForm
              type={type}
              handleChange={key => update => {
                console.log(key, update);
                setNewConfig({ ...newConfig, [key]: update });
              }}
              config={newConfig}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSave(fieldName, { config: newConfig });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
