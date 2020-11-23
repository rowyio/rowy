import React, { useState, lazy, Suspense } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slider from "@material-ui/core/Slider";
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
import FieldsDropdown from "../FieldsDropdown";
import ColumnSelector from "./ConfigFields/ColumnSelector";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";

const CodeEditor = lazy(
  () => import("../../editors/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);
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
      return (
        <ColumnSelector
          label={"Parent Label"}
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
    case FieldType.rating:
      return (
        <>
          <Typography variant="overline">Maximum number of stars</Typography>
          <Slider
            defaultValue={5}
            value={config.max}
            getAriaValueText={(v) => `${v} max stars`}
            aria-labelledby="max-slider"
            valueLabelDisplay="auto"
            onChange={(_, v) => {
              handleChange("max")(v);
            }}
            step={1}
            marks
            min={1}
            max={15}
          />
          <Typography variant="overline">Slider precision stars</Typography>
          <Slider
            defaultValue={0.5}
            value={config.precision}
            getAriaValueText={(v) => `${v} rating step size`}
            aria-labelledby="precision-slider"
            valueLabelDisplay="auto"
            onChange={(_, v) => {
              handleChange("precision")(v);
            }}
            step={0.25}
            marks
            min={0.25}
            max={1}
          />
        </>
      );
    case FieldType.action:
      return (
        <>
          <Typography variant="overline">Allowed roles</Typography>
          <Typography variant="body2">
            Authenticated user must have at least one of these to run the script
          </Typography>
          <MultiSelect
            label={"Allowed Roles"}
            options={roles}
            value={config.requiredRoles ?? []}
            onChange={handleChange("requiredRoles")}
          />

          <Typography variant="overline">Required fields</Typography>
          <Typography variant="body2">
            All of the selected fields must have a value for the script to run
          </Typography>
          <ColumnSelector
            label={"Required fields"}
            value={config.requiredFields}
            tableColumns={
              columns
                ? Array.isArray(columns)
                  ? columns
                  : Object.values(columns)
                : []
            }
            handleChange={handleChange("requiredFields")}
          />
          <Divider />
          <Typography variant="overline">Confirmation Template</Typography>
          <Typography variant="body2">
            The action button will not ask for confirmation if this is left
            empty
          </Typography>

          <TextField
            label="Confirmation Template"
            placeholder="Are sure you want to invest {{stockName}}?"
            value={config.confirmation}
            onChange={(e) => {
              handleChange("confirmation")(e.target.value);
            }}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.isActionScript}
                onChange={() =>
                  handleChange("isActionScript")(
                    !Boolean(config.isActionScript)
                  )
                }
                name="actionScript"
              />
            }
            label="Set as an action script"
          />
          {!Boolean(config.isActionScript) ? (
            <TextField
              label="callable name"
              name="callableName"
              value={config.callableName}
              fullWidth
              onChange={(e) => {
                handleChange("callableName")(e.target.value);
              }}
            />
          ) : (
            <>
              <Typography variant="overline">action script</Typography>
              <Suspense fallback={<FieldSkeleton height={300} />}>
                <CodeEditor
                  height={300}
                  script={config.script}
                  extraLibs={[
                    [
                      "declare class ref {",
                      "    /**",
                      "     * Reference object of the row running the action script",
                      "     */",
                      "static id:string",
                      "static path:string",
                      "static parentId:string",
                      "static tablePath:string",
                      "}",
                    ].join("\n"),
                    [
                      "declare class actionParams {",
                      "    /**",
                      "     * actionParams are provided by dialog popup form",
                      "     */",
                      (config.params ?? []).map((param) => {
                        const validationKeys = Object.keys(param.validation);
                        if (validationKeys.includes("string")) {
                          return `static ${param.name}:string`;
                        } else if (validationKeys.includes("array")) {
                          return `static ${param.name}:any[]`;
                        } else return `static ${param.name}:any`;
                      }),
                      "}",
                    ],
                  ]}
                  handleChange={handleChange("script")}
                />
              </Suspense>
              <FormControlLabel
                control={
                  <Switch
                    checked={config["redo.enabled"]}
                    onChange={() =>
                      handleChange("redo.enabled")(
                        !Boolean(config["redo.enabled"])
                      )
                    }
                    name="redo toggle"
                  />
                }
                label="enable redo(reruns the same script)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config["undo.enabled"]}
                    onChange={() =>
                      handleChange("undo.enabled")(
                        !Boolean(config["undo.enabled"])
                      )
                    }
                    name="undo toggle"
                  />
                }
                label="enable undo"
              />
              {config["undo.enabled"] && (
                <>
                  <Typography variant="overline">
                    Undo Confirmation Template
                  </Typography>
                  <TextField
                    label="template"
                    placeholder="are you sure you want to sell your stocks in {{stockName}}"
                    value={config["undo.confirmation"]}
                    onChange={(e) => {
                      handleChange("undo.confirmation")(e.target.value);
                    }}
                    fullWidth
                  />
                  <Typography variant="overline">Undo Action script</Typography>
                  <Suspense fallback={<FieldSkeleton height={300} />}>
                    <CodeEditor
                      height={300}
                      script={config["undo.script"]}
                      handleChange={handleChange("undo.script")}
                    />
                  </Suspense>
                </>
              )}
            </>
          )}
        </>
      );
    case FieldType.aggregate:
      return (
        <>
          <ColumnSelector
            label={"Sub Tables"}
            validTypes={[FieldType.subTable]}
            value={config.subtables}
            tableColumns={
              columns
                ? Array.isArray(columns)
                  ? columns
                  : Object.values(columns)
                : []
            }
            handleChange={handleChange("subtables")}
          />

          <Typography variant="overline">Aggergate script</Typography>
          <Suspense fallback={<FieldSkeleton height={200} />}>
            <CodeEditor
              script={
                config.script ??
                `//triggerType:  create | update | delete\n//aggregateState: the subtable accumenlator stored in the cell of this column\n//snapshot: the triggered document snapshot of the the subcollection\n//incrementor: short for firebase.firestore.FieldValue.increment(n);\n//This script needs to return the new aggregateState cell value.
switch (triggerType){
  case "create":return {
      count:incrementor(1)
  }
  case "update":return {}
  case "delete":
  return {
      count:incrementor(-1)
  }
}`
              }
              extraLibs={[
                `  /**
    * increaments firestore field value
    */",
    function incrementor(value:number):number {

    }`,
              ]}
              handleChange={handleChange("script")}
            />
          </Suspense>

          <Typography variant="overline">Field type of the output</Typography>
          <FieldsDropdown
            value={config.renderFieldType}
            options={Object.values(FieldType).filter(
              (f) =>
                ![
                  FieldType.derivative,
                  FieldType.aggregate,
                  FieldType.subTable,
                  FieldType.action,
                ].includes(f)
            )}
            onChange={(newType: any) => {
              handleChange("renderFieldType")(newType.target.value);
            }}
          />
          {config.renderFieldType && (
            <>
              <Typography variant="overline">Rendered field config</Typography>
              <ConfigFields
                fieldType={config.renderFieldType}
                config={config}
                handleChange={handleChange}
                tables={tables}
                columns={columns}
                roles={roles}
              />
            </>
          )}
        </>
      );
    case FieldType.derivative:
      return (
        <>
          <ColumnSelector
            label={
              "Listener fields (this script runs when these fields change)"
            }
            value={config.listenerFields}
            tableColumns={
              columns
                ? Array.isArray(columns)
                  ? columns
                  : Object.values(columns)
                : []
            }
            handleChange={handleChange("listenerFields")}
          />

          <Typography variant="overline">derivative script</Typography>
          <Suspense fallback={<FieldSkeleton height={200} />}>
            <CodeEditor
              script={config.script}
              handleChange={handleChange("script")}
            />
          </Suspense>

          <Typography variant="overline">Field type of the output</Typography>
          <FieldsDropdown
            value={config.renderFieldType}
            options={Object.values(FieldType).filter(
              (f) =>
                ![
                  FieldType.derivative,
                  FieldType.aggregate,
                  FieldType.subTable,
                  FieldType.action,
                ].includes(f)
            )}
            onChange={(newType: any) => {
              handleChange("renderFieldType")(newType.target.value);
            }}
          />
          {config.renderFieldType && (
            <>
              <Typography variant="overline"> Rendered field config</Typography>
              <ConfigFields
                fieldType={config.renderFieldType}
                config={config}
                handleChange={handleChange}
                tables={tables}
                columns={columns}
                roles={roles}
              />
            </>
          )}
        </>
      );
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
          <Typography variant="overline"></Typography>

          {
            <ConfigForm
              type={type}
              handleChange={(key) => (update) => {
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
