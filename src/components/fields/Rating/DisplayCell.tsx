import React, { forwardRef } from "react";
import { IDisplayCellProps } from "@src/components/fields/types";

import MuiRating, { RatingProps as MuiRatingProps } from "@mui/material/Rating";
import RatingIcon from "@mui/icons-material/Star";
import RatingOutlineIcon from "@mui/icons-material/StarBorder";
import { get } from "lodash-es";

export const getStateIcon = (config: any) => {
  // only use the config to get the custom rating icon if enabled via toggle
  if (!get(config, "customIcons.enabled")) {
    return <RatingIcon />;
  }
  return get(config, "customIcons.rating") || <RatingIcon />;
};

export const getStateOutline = (config: any) => {
  if (!get(config, "customIcons.enabled")) {
    return <RatingOutlineIcon />;
  }
  return get(config, "customIcons.rating") || <RatingOutlineIcon />;
};

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
      icon={getStateIcon(column.config)}
      size="small"
      readOnly={disabled}
      emptyIcon={getStateOutline(column.config)}
      max={max}
      precision={precision}
      sx={{ mx: -0.25 }}
    />
  );
});
export default Rating;
