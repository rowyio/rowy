import { IHeavyCellProps } from "../types";

import MuiRating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import { useRatingStyles } from "./styles";

export default function Rating({
  row,
  column,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const ratingClasses = useRatingStyles();

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
      name={`${row.id}-${column.key as string}`}
      value={typeof value === "number" ? value : 0}
      onClick={(e) => e.stopPropagation()}
      disabled={disabled}
      onChange={(_, newValue) => onSubmit(newValue)}
      emptyIcon={<StarBorderIcon />}
      max={max}
      precision={precision}
      classes={ratingClasses}
    />
  );
}
