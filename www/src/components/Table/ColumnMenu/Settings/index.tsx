import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Typography,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FieldType } from "constants/fields";
import OptionsInput from "./ConfigFields/OptionsInput";
import { useFiretableContext } from "contexts/FiretableContext";
import MultiSelect from "@antlerengineering/multiselect";
import _sortBy from "lodash/sortBy";
import ColumnSelector from "./ConfigFields/ColumnSelector";
import { getFieldProp } from "components/fields";
import SettingsHeading from "./SettingsHeading";
const ConfigFields = ({
  fieldType,
  config,
  handleChange,
  tables,
  columns,
  roles,
}) => {
  switch (fieldType) {
    case FieldType.longText:
    case FieldType.shortText:
      return (
        <>
          <TextField
            type="number"
            value={config.maxLength}
            label={"Character Limit"}
            fullWidth
            onChange={(e) => {
              if (e.target.value === "0") handleChange("maxLength")(null);
              else handleChange("maxLength")(e.target.value);
            }}
          />
        </>
      );
    case FieldType.singleSelect:
    case FieldType.multiSelect:
      return (
        <>
          <OptionsInput
            options={config.options ?? []}
            handleChange={handleChange("options")}
          />
          <SettingsHeading>ADD NEW?</SettingsHeading>
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
    case FieldType.connectService:
      return (
        <>
          <TextField
            label="Webservice Url"
            name="url"
            value={config.url}
            fullWidth
            onChange={(e) => {
              handleChange("url")(e.target.value);
            }}
          />
          <TextField
            label="Results key Path"
            name="resultsKey"
            helperText="Can be specified as a key path"
            placeholder="data.results"
            value={config.resultsKey}
            fullWidth
            onChange={(e) => {
              handleChange("resultsKey")(e.target.value);
            }}
          />
          <TextField
            label="Primary Key"
            name="primaryKey"
            value={config.primaryKey}
            fullWidth
            onChange={(e) => {
              handleChange("primaryKey")(e.target.value);
            }}
          />
          <TextField
            label="Title Key (optional)"
            name="titleKey"
            value={config.titleKey}
            fullWidth
            onChange={(e) => {
              handleChange("titleKey")(e.target.value);
            }}
          />
          <TextField
            label="SubTitle Key (optional)"
            name="subtitleKey"
            value={config.subtitleKey}
            fullWidth
            onChange={(e) => {
              handleChange("subtitleKey")(e.target.value);
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.multiple}
                onChange={() =>
                  handleChange("multiple")(!Boolean(config.multiple))
                }
                name="select-multiple"
              />
            }
            label="Enable multiple item selection"
          />
        </>
      );
    case FieldType.connectTable:
      const tableOptions = _sortBy(
        tables?.map((t) => ({
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
            label={"Primary Keys"}
            value={config.primaryKeys}
            table={config.index}
            handleChange={handleChange("primaryKeys")}
            validTypes={[FieldType.shortText, FieldType.singleSelect]}
          />
          <TextField
            label="filter template"
            name="filters"
            fullWidth
            value={config.filters}
            onChange={(e) => {
              handleChange("filters")(e.target.value);
            }}
          />
        </>
      );
    case FieldType.subTable:
    case FieldType.rating:
    case FieldType.action:
    case FieldType.aggregate:
    case FieldType.derivative:

    default:
      return <></>;
  }
};
const ConfigForm = ({ type, config, handleChange }) => {
  const { tableState, tables, roles } = useFiretableContext();

  if (!tableState) return <></>;
  const { columns } = tableState;

  return (
    <ConfigFields
      fieldType={type}
      columns={columns}
      config={config}
      handleChange={handleChange}
      tables={tables}
      roles={roles}
    />
  );
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
  const customFieldSettings = getFieldProp("settings", type);

  return (
    <div>
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={(e, r) => {
          handleClose();
        }}
        aria-labelledby="form-column-settings"
      >
        <DialogContent>
          <Grid
            style={{ minWidth: 450 }}
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

          <SettingsHeading style={{ marginTop: 0 }}>Required?</SettingsHeading>
          <Typography color="textSecondary" paragraph>
            The row will not be created or updated unless all required values
            are set.
          </Typography>

          <Grid container justify="space-between">
            <Typography variant="body1">Make this column required</Typography>
            <Switch
              checked={newConfig["required"]}
              onChange={() =>
                setNewConfig({
                  ...newConfig,
                  required: !Boolean(newConfig["required"]),
                })
              }
              name="required"
            />
          </Grid>

          {/* <SettingsHeading>Default value</SettingsHeading>
          <Typography color="textSecondary" paragraph>
            The default value will be the initial value of the cells, whenever a
            new row is added.
          </Typography> */}
          {/* <>render field component here</> */}

          {React.createElement(customFieldSettings, {
            config: newConfig,
            handleChange: (key) => (update) => {
              setNewConfig({ ...newConfig, [key]: update });
            },
          })}

          {/* {
            <ConfigForm
              type={type}
              
              config={newConfig}
            />
          } */}
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
