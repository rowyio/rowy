import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField } from "@mui/material";
import { getFieldId } from "@src/components/SideDrawer/utils";
import { useFormula } from "./useFormula";
import { defaultFn } from "./util";

export default function Formula({
  column,
  onChange,
  onSubmit,
  disabled,
  _rowy_ref,
  row,
}: ISideDrawerFieldProps) {
  const { result, error, loading } = useFormula({
    row: row,
    ref: _rowy_ref,
    listenerFields: column.config?.listenerFields || [],
    formulaFn: column.config?.formulaFn || defaultFn,
  });

  if (error) {
    return <>Error: {error.message}</>;
  }

  if (loading) {
    return <CircularProgressOptical id="progress" size={20} sx={{ m: 0.25 }} />;
  }

  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      onChange={(e) => onChange(Number(e.target.value))}
      onBlur={onSubmit}
      value={result || ""}
      id={getFieldId(column.key)}
      label=""
      hiddenLabel
      disabled={disabled}
      type="number"
    />
  );
}
