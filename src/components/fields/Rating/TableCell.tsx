import { IHeavyCellProps } from "../types";

import MuiRating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function Rating({
  row,
  column,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  // Set max and precision from config
  const {
    max,
    precision,
  }: {
    max: number;
    precision: number;
  } = {
    max: 5,
    precision: 1,
    ...column.config,
  };

  return (
    <MuiRating
      name={`${row.id}-${column.key}`}
      value={typeof value === "number" ? value : 0}
      onClick={(e) => e.stopPropagation()}
      disabled={disabled}
      onChange={(_, newValue) => onSubmit(newValue)}
      emptyIcon={<StarBorderIcon />}
      max={max}
      precision={precision}
      sx={{ mx: -0.25 }}
    />
  );
}
