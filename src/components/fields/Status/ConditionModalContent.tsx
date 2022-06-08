import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MultiSelect from "@rowy/multiselect";

export default function ConditionModalContent({
  condition,
  handleUpdate,
}: any) {
  const { label, operator, type, value } = condition;

  return (
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
        onChange={(v) => handleUpdate("type")(v)}
        value={type}
        multiple={false}
        label="Select data type"
      />
      {/** This is the issue where false is causing a problem */}
      {/** To add defaultValue into MultiSelect?*/}
      {type === "boolean" && (
        <MultiSelect
          options={[
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ]}
          onChange={(v) => handleUpdate("value")(v === "true")}
          value={value ? "true" : "false"}
          multiple={false}
          label="Select condition value"
        />
      )}
      {type === "number" && (
        <Grid container direction="row" justifyContent="space-between">
          <MultiSelect
            options={[
              { label: "Less than", value: "<" },
              { label: "Less than or equal", value: "<=" },
              { label: "Equal", value: "==" },
              { label: "Equal or more than", value: ">=" },
              { label: "More than", value: ">" },
            ]}
            onChange={(v) => handleUpdate("operator")(v)}
            value={operator}
            multiple={false}
            label="Select operator"
          />
          <TextField
            fullWidth
            type="number"
            label="Value"
            value={value}
            onChange={(e) => handleUpdate("value")(Number(e.target.value))}
          />
        </Grid>
      )}
      {type === "string" && (
        <TextField
          fullWidth
          label="Value"
          value={value}
          onChange={(e) => handleUpdate("value")(e.target.value)}
        />
      )}
      <TextField
        value={label}
        label="Cell label"
        fullWidth
        onChange={(e) => handleUpdate("label")(e.target.value)}
      />
    </>
  );
}
