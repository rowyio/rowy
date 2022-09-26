import { IHeavyCellProps } from "@src/components/fields/types";

import { Grid } from "@mui/material";
import { useFormula } from "./useFormula";

export default function Formula({ row, column, onSubmit }: IHeavyCellProps) {
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
