import React, { forwardRef } from "react";
import { IDisplayCellProps } from "@src/components/fields/types";

import MuiRating, { RatingProps as MuiRatingProps } from "@mui/material/Rating";
import Icon from "./Icon";

export const Rating = forwardRef(function Rating(
  {
    _rowy_ref,
    column,
    value,
    disabled,
    onChange,
  }: IDisplayCellProps & Pick<MuiRatingProps, "onChange">,
  ref: React.Ref<HTMLElement>
) {
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
      ref={ref}
      onChange={onChange}
      name={`${_rowy_ref.path}-${column.key}`}
      value={typeof value === "number" ? value : 0}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
          e.stopPropagation();
      }}
      icon={<Icon config={column.config} isEmpty={false} />}
      emptyIcon={<Icon config={column.config} isEmpty={true} />}
      size="small"
      readOnly={disabled}
      max={max}
      precision={precision}
      sx={{ mx: -0.25 }}
    />
  );
});

export default Rating;
