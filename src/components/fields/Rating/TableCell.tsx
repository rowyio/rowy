import { IHeavyCellProps } from "@src/components/fields/types";

import MuiRating from "@mui/material/Rating";
import RatingIcon from "@mui/icons-material/Star";
import { get } from "lodash-es";
import { MonitorSmall } from "mdi-material-ui";


export const getStateIcon = (config: any) => {
  // only use the config to get the custom rating icon if enabled via toggle
  if (!get(config, "customIcons.enabled")) { return <RatingIcon /> }
  return get(config, "customIcons.rating") || <RatingIcon />;
};

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
      icon={getStateIcon(column.config)}
      size="small"
      disabled={disabled}
      onChange={(_, newValue) => onSubmit(newValue)}
      emptyIcon={getStateIcon(column.config)}
      max={max}
      precision={precision}
      sx={{ mx: -0.25 }}
    />
  );
}
