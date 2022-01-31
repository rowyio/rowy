import _find from "lodash/find";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MultiSelect from "@rowy/multiselect";

interface I_ConditionModalContent {
  handleUpdate: () => void;
  modal: any;
}

const multiSelectOption = [
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "String", value: "string" },
  { label: "Undefined", value: "undefined" },
  { label: "Null", value: "null" },
];

const booleanOptions = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

const operatorOptions = [
  { label: "Less than", value: "<" },
  { label: "Less than or equal", value: "<=" },
  { label: "Equal", value: "==" },
  { label: "Equal or more than", value: ">=" },
  { label: "More than", value: ">" },
];

export default function ConditionModalContent({
  condition,
  conditions,
  handleUpdate,
}: any) {
  const { label, operator, type, value } = condition;
  const duplicateCond = Boolean(_find(conditions, condition));
  const labelReqLen = Boolean(condition.label.length < 4);
  return (
    <>
      <Typography variant="overline">DATA TYPE (input)</Typography>
      <MultiSelect
        options={multiSelectOption}
        onChange={(v) => handleUpdate("type")(v)}
        value={type}
        multiple={false}
        label="Select data type"
      />
      {/** This is the issue where false is causing a problem */}
      {/** To add defaultValue into MultiSelect?*/}
      {type === "boolean" && (
        <MultiSelect
          options={booleanOptions}
          onChange={(v) => handleUpdate("value")(v === "true")}
          value={value ? "true" : "false"}
          multiple={false}
          label="Select condition value"
        />
      )}
      {type === "number" && (
        <Grid container direction="row" justifyContent="space-between">
          <div style={{ width: "45%" }}>
            {console.log(operatorOptions)}
            <MultiSelect
              options={operatorOptions}
              onChange={(v) => handleUpdate("operator")(v)}
              value={operator}
              multiple={false}
              label="Select operator"
            />
          </div>
          <TextField
            error={duplicateCond}
            type="number"
            label="Value"
            value={value}
            onChange={(e) => handleUpdate("value")(Number(e.target.value))}
            helperText={
              duplicateCond ? "Numeric Conditional already exists" : ""
            }
          />
        </Grid>
      )}
      {type === "string" && (
        <TextField
          error={duplicateCond}
          fullWidth
          label="Value"
          value={value}
          onChange={(e) => handleUpdate("value")(e.target.value)}
          helperText={duplicateCond ? "string value already exists" : ""}
        />
      )}
      <TextField
        error={labelReqLen}
        value={label}
        label="Label"
        fullWidth
        onChange={(e) => handleUpdate("label")(e.target.value)}
      />
    </>
  );
}
