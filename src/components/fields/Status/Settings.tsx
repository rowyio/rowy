import { useState, useEffect } from "react";
import { ISettingsProps } from "../types";

import Subheading from "@src/components/Table/ColumnMenu/Subheading";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@src/components/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MultiSelect from "@rowy/multiselect";

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
    handleUpdate("operator")(modal.condition.operator ?? "==");
  }, [modal.condition.type]);
  return (
    <Modal
      open={modal.isOpen}
      title={`${modal.index ? "Edit" : "Add"} condition`}
      maxWidth={"xs"}
      onClose={handleClose}
      actions={{
        primary:
          modal.index === null
            ? {
                children: "Add condition",
                onClick: handleAdd,
                disabled: false,
              }
            : {
                children: "Save changes",
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
                children: "Remove condition",
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
            label="Select data type"
          />
          <Typography variant="overline">Condition </Typography>
          {modal.condition.type === "boolean" && (
            <MultiSelect
              options={[
                { label: "True", value: "true" },
                { label: "False", value: "false" },
              ]}
              onChange={(v) => handleUpdate("value")(v === "true")}
              value={modal.condition.value ? "true" : "false"}
              multiple={false}
              label="Select condition value"
            />
          )}

          {modal.condition.type === "number" && (
            <Grid container direction="row" justifyContent="space-between">
              <div style={{ width: "45%" }}>
                <MultiSelect
                  options={[
                    { label: "Less than", value: "<" },
                    { label: "Less than or equal", value: "<=" },
                    { label: "Equal", value: "==" },
                    { label: "Equal or more than", value: ">=" },
                    { label: "More than", value: ">" },
                  ]}
                  onChange={handleUpdate("operator")}
                  value={modal.condition.operator}
                  multiple={false}
                  label="Select operator"
                />
              </div>
              <TextField
                type="number"
                label="Value"
                value={modal.condition.value}
                onChange={(e) => handleUpdate("value")(e.target.value)}
              />
            </Grid>
          )}
          {modal.condition.type === "string" && (
            <TextField
              fullWidth
              label="Value"
              value={modal.condition.value}
              onChange={(e) => handleUpdate("value")(e.target.value)}
            />
          )}

          <Typography variant="overline">Assigned label (output)</Typography>
          <TextField
            value={modal.condition.label}
            label="Type the cell output"
            fullWidth
            onChange={(e) => handleUpdate("label")(e.target.value)}
          />
        </>
      }
    />
  );
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const [modal, setModal] = useState(EMPTY_STATE);
  const { conditions } = config;
  return (
    <>
      <Subheading>Conditions</Subheading>
      {conditions ? (
        conditions.map((condition, index) => {
          return (
            <>
              <Grid
                container
                justifyContent="space-between"
                alignItems={"center"}
              >
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
          No conditions set yet
          <br />
        </>
      )}

      <Button
        onClick={() => setModal({ ...EMPTY_STATE, isOpen: true })}
        startIcon={<AddIcon />}
      >
        Add condition
      </Button>
      <ConditionModal
        modal={modal}
        setModal={setModal}
        conditions={config.conditions}
        setConditions={onChange("conditions")}
      />
    </>
  );
}
