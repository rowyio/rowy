import { useState, useEffect } from "react";
import { ISettingsProps } from "../types";

import Subheading from "components/Table/ColumnMenu/Subheading";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import _sortBy from "lodash/sortBy";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "components/Modal";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MultiSelect from "@antlerengineering/multiselect";

const EMPTY_STATE: {
  isOpen: boolean;
  index: number | null;
  condition: {
    type: string;
    value: any;
    label: string;
    operator: string | undefined;
  };
} = {
  index: null,
  isOpen: false,
  condition: {
    type: "null",
    value: null,
    label: "",
    operator: "==",
  },
};
const ConditionModal = ({ modal, setModal, conditions, setConditions }) => {
  const handleClose = () => {
    setModal(EMPTY_STATE);
  };
  const handleSave = () => {
    let _conditions = [...conditions];
    _conditions[modal.index] = modal.condition;
    setConditions(_conditions);
    setModal(EMPTY_STATE);
  };
  const handleAdd = () => {
    setConditions(
      conditions ? [...conditions, modal.condition] : [modal.condition]
    );
    setModal(EMPTY_STATE);
  };
  const handleRemove = () => {
    let _conditions = [...conditions];
    delete _conditions[modal.index];
    setConditions(_conditions);
    setModal(EMPTY_STATE);
  };
  const handleUpdate = (key: string) => (value) => {
    setModal({ ...modal, condition: { ...modal.condition, [key]: value } });
  };
  useEffect(() => {
    handleUpdate("operator")("==");
  }, [modal.condition.type]);
  return (
    <Modal
      open={modal.isOpen}
      title={`${modal.index ? "Edit" : "Add"} Condition`}
      maxWidth={"xs"}
      onClose={handleClose}
      actions={{
        primary:
          modal.index === null
            ? {
                children: "Add Condition",
                onClick: handleAdd,
                disabled: false,
              }
            : {
                children: "Save Changes",
                onClick: handleSave,
                disabled: false,
              },
        secondary:
          modal.index === null
            ? {
                children: "Cancel",
                onClick: () => {
                  setModal(EMPTY_STATE);
                },
              }
            : {
                startIcon: <DeleteIcon />,
                children: "Remove Condition",
                onClick: handleRemove,
              },
      }}
      children={
        <>
          <Typography variant="overline">DATA TYPE (input)</Typography>
          <MultiSelect
            options={[
              { label: "Boolean", value: "boolean" },
              { label: "Number", value: "number" },
              { label: "String", value: "string" },
              { label: "Undefined", value: "undefined" },
              { label: "Null", value: "null" },
            ]}
            onChange={handleUpdate("type")}
            value={modal.condition.type}
            multiple={false}
            label={"Select data type"}
          />
          <Typography variant="overline">Condition</Typography>
          {modal.condition.type === "boolean" && (
            <MultiSelect
              options={[
                { label: "True", value: "true" },
                { label: "False", value: "false" },
              ]}
              onChange={(v) => handleUpdate("value")(v === "true")}
              value={modal.condition.value ? "true" : "false"}
              multiple={false}
              label={"Select Condition Value"}
            />
          )}

          {modal.condition.type === "number" && (
            <Grid container direction="row" justify="space-between">
              <div style={{ width: "45%" }}>
                <MultiSelect
                  options={[
                    { label: "Less Than", value: "<" },
                    { label: "Less Than or Equal", value: "<=" },
                    { label: "Equal", value: "==" },
                    { label: "Equal or More Than", value: ">=" },
                    { label: "More Than", value: ">" },
                  ]}
                  onChange={handleUpdate("operator")}
                  value={modal.condition.operator}
                  multiple={false}
                  label={"Select Operator"}
                />
              </div>
              <TextField
                type={"number"}
                label={"Value"}
                value={modal.condition.value}
                onChange={(e) => handleUpdate("value")(e.target.value)}
              />
            </Grid>
          )}
          {modal.condition.type === "string" && (
            <TextField
              fullWidth
              label={"Value"}
              value={modal.condition.value}
              onChange={(e) => handleUpdate("value")(e.target.value)}
            />
          )}

          <Typography variant="overline">assigned label (output)</Typography>
          <TextField
            value={modal.condition.label}
            label={"Type the cell output"}
            fullWidth
            onChange={(e) => handleUpdate("label")(e.target.value)}
          />
        </>
      }
    />
  );
};

export default function Settings({ handleChange, config }: ISettingsProps) {
  const [modal, setModal] = useState(EMPTY_STATE);
  const { conditions } = config;
  return (
    <>
      <Subheading>Conditions</Subheading>
      {conditions ? (
        conditions.map((condition, index) => {
          return (
            <>
              <Grid container justify="space-between" alignItems={"center"}>
                {condition.label}
                <Grid item>
                  {["undefined", "null"].includes(condition.type)
                    ? condition.type
                    : `${condition.type}:${
                        condition.type === "number" ? condition.operator : ""
                      }${
                        condition.type === "boolean"
                          ? JSON.stringify(condition.value)
                          : condition.value
                      }`}
                  <IconButton
                    onClick={() => {
                      setModal({ isOpen: true, condition, index });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Divider />
            </>
          );
        })
      ) : (
        <>
          no conditions set yet
          <br />
        </>
      )}

      <Button onClick={() => setModal({ ...EMPTY_STATE, isOpen: true })}>
        + ADD CONDITION
      </Button>
      <ConditionModal
        modal={modal}
        setModal={setModal}
        conditions={config.conditions}
        setConditions={handleChange("conditions")}
      />
    </>
  );
}
