import { Grid } from "@mui/material";
import { IDisplayCellProps } from "@src/components/fields/types";
import { useFormula } from "./useFormula";

export default function Formula({ row, column }: IDisplayCellProps) {
  const { result, error } = useFormula({
    row,
    formulaFn: column.config?.formulaFn,
  });

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      {error ? error.message : result}
    </Grid>
  );
}
