import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Typography, IconButton, TextField, Switch } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FieldType } from "constants/fields";
import OptionsInput from "./ConfigFields/OptionsInput";
import { useFiretableContext } from "contexts/firetableContext";
import MultiSelect from "@antlerengineering/multiselect";
import { db } from "../../../firebase";
import _sortBy from "lodash/sortBy";
const ColumnSelector = ({
  tableColumns,
  handleChange,
  validTypes,
  table,
  value,
}: {
  tableColumns?: any[];
  handleChange: any;
  validTypes: FieldType[];
  table?: string;
  value: any;
}) => {
  const [columns, setColumns] = useState(tableColumns ?? []);
  const getColumns = async table => {
    const tableConfigDoc = await db
      .doc(`_FIRETABLE_/settings/schema/${table}`)
      .get();
    const tableConfig = tableConfigDoc.data();

    if (tableConfig) setColumns(tableConfig.columns ?? []);
  };
  useEffect(() => {
    if (table) {
      console.log({ table });
      getColumns(table);
    }
  }, [table]);
  console.log({ columns });
  const options = columns
    ? columns
        .filter(col => validTypes.includes(col.type))
        .map(col => ({ value: col.key, label: col.name }))
    : [];
  return (
    <MultiSelect
      onChange={handleChange}
      value={value ?? []}
      options={options}
    />
  );
};

const ConfigForm = ({ type, config, handleChange }) => {
  const { tableState, tables } = useFiretableContext();

  if (!tableState) return <></>;
  const { columns } = tableState;
  switch (type) {
    case FieldType.singleSelect:
    case FieldType.multiSelect:
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
    case FieldType.connectTable:
      const tableOptions = _sortBy(
        tables?.map(t => ({
          label: `${t.section} - ${t.name}`,
          value: t.collection,
        })) ?? [],
        "label"
      );

      return (
        <>
          <MultiSelect
            options={tableOptions}
            freeText={false}
            value={config.index}
            onChange={handleChange("index")}
            multiple={false}
          />
          <ColumnSelector
            value={config.primaryKeys}
            table={config.index}
            handleChange={handleChange("primaryKeys")}
            validTypes={[FieldType.shortText, FieldType.singleSelect]}
          />
          <TextField
            label="filter template"
            name="filters"
            fullWidth
            onChange={e => {
              handleChange("filters")(e.target.value);
            }}
          />
        </>
      );
    case FieldType.subTable:
      return (
        <ColumnSelector
          value={config.parentLabel}
          tableColumns={
            columns
              ? Array.isArray(columns)
                ? columns
                : Object.values(columns)
              : []
          }
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
