import _find from "lodash/find";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MultiSelect from "@rowy/multiselect";

interface I_ConditionModalContent {
  handleUpdate: () => void;
  modal: any;
}

export default function ConditionModalContent({
  isEditing,
  condition,
  conditions,
  handleUpdate,
}: any) {
  const { label, operator, type, value } = condition;
  const labelReqLen = Boolean(condition.label.length < 1);
  const onNewHasDuplicate = Boolean(_find(conditions, condition));
  const onEditConditions = conditions.filter(
    (c) => c.value !== condition.value
  ); //remove the current condition from list of conditions, to prevent false positive error on duplicate value
  const onEditHasDuplicate = Boolean(_find(onEditConditions, condition));

  const errorTextType = (isEditing: boolean, error: string) => {
    const hasError = isEditing ? onEditHasDuplicate : onNewHasDuplicate;
    return hasError ? error : "";
  };

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
          <div style={{ width: "45%" }}>
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
          </div>
          <TextField
            error={isEditing ? onEditHasDuplicate : onNewHasDuplicate}
            type="number"
            label="Value"
            value={value}
            onChange={(e) => handleUpdate("value")(Number(e.target.value))}
            helperText={errorTextType(isEditing, "Number value already exists")}
          />
        </Grid>
      )}
      {type === "string" && (
        <TextField
          error={isEditing ? onEditHasDuplicate : onNewHasDuplicate}
          fullWidth
          label="Value"
          value={value}
          onChange={(e) => handleUpdate("value")(e.target.value)}
          helperText={errorTextType(isEditing, "String value already exists")}
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
